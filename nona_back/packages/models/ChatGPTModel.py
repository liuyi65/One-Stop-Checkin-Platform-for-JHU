import openai
import tiktoken

def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0301"):
    """Returns the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    if model == "gpt-3.5-turbo-0301":  # note: future models may deviate from this
        num_tokens = 0
        for message in messages:
            num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
            for key, value in message.items():
                num_tokens += len(encoding.encode(value))
                if key == "name":  # if there's a name, the role is omitted
                    num_tokens += -1  # role is always required and always 1 token
        num_tokens += 2  # every reply is primed with <im_start>assistant
        return num_tokens
    else:
        raise NotImplementedError(f"""num_tokens_from_messages() is not presently implemented for model {model}.""")

def price_calculate_by_token(num_tokens, price_per_thousand=0.002):
    """Returns the price of a completion given a number of tokens and a price per thousand tokens."""
    return num_tokens * price_per_thousand / 1000

def price_calculate(msg, price_per_thousand=0.002):
    """Returns the price of a completion given a number of tokens and a price per thousand tokens."""
    num_tokens = num_tokens_from_messages(msg)
    return num_tokens * price_per_thousand / 1000

class Message():
    def __init__(self, content, role="user", name = None, direct_to_me=True) -> None:
        self.role = role
        self.content = content
        self.name = name
        self.direct_to_me = direct_to_me

    def get_dict(self) -> dict:
        ret = {
            "role": self.role,
            "content": self.content
        }
        if self.name:
            ret["name"] = self.name
        return ret
    

class ChatModel():

    def __init__(self) -> None:
        self.max_price = 0.3
        self.indirect_message_price = 0.05
        self.init_message = [
            self.new_message("system", 'You are a helpful assistant of an appointment system called NoNa. You are helping a user to check their appointments.'),
            self.new_message("system", "You can only view the appointments of the user. You cannot do any operation on the appointments. Including create, delete, update, etc.")
        ]
        self.reset_session()

    def new_message(self, role, content, name = None, direct_to_me=True) -> dict:
        return Message(content, role, name, direct_to_me)

    def reset_session(self) -> None:
        self.messages = self.init_message.copy()
        self.indirect_messages = []

    def get_messages_list(self, messages) -> list:
        return [message.get_dict() for message in messages]

    def append_message(self, content, direct=False, by_assistant=False) -> None:

        while price_calculate(self.get_messages_list(self.indirect_messages)) > self.indirect_message_price:
            self.messages.remove(self.indirect_messages[0])
            self.indirect_messages.pop(0)
        

        if price_calculate(self.get_messages_list(self.messages)) > self.max_price:
            self.reset_session()
            raise Exception("Price too high, reset session")

        role = "assistant" if by_assistant else "user"

        msg = self.new_message(role, content, direct_to_me=direct)

        pure_msg = [msg.get_dict()]
        if price_calculate(pure_msg) > 0.2:
            return
        
        if not direct:
            self.indirect_messages.append(msg)
        self.messages.append(msg)            

    def append_message_from_assistant(self, content) -> None:
        self.append_message(content, by_assistant=True, direct=True)

    def append_message_from_user(self, content, direct=False) -> None:
        self.append_message(content, direct=direct)

    def get_overall_price(self) -> float:
        return price_calculate(self.get_messages_list(self.messages))
    
    def send_feedback(self) -> str:
        try:
            ret = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-0301",
                # model="gpt-3.5-turbo",
                max_tokens=1000,
                temperature=0.2,
                top_p=1,
                frequency_penalty=0.0,
                presence_penalty=0.1,
                messages=self.get_messages_list(self.messages)
            )
            self.append_message_from_assistant(ret.choices[0].message.content)
            price = price_calculate_by_token(ret.usage.total_tokens)
            return ret.choices[0].message.content, price
        except Exception as e:
            self.reset_session()
            return "Sorry, something went wrong. Please try again later.", 0
    



