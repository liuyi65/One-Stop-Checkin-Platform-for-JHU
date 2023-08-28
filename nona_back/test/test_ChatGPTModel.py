import unittest
from packages.models.ChatGPTModel import *
from unittest.mock import MagicMock
class TestChatModel(unittest.TestCase):
    def setUp(self):
        self.chat_model = ChatModel()

    def test_new_message(self):
        role = 'user'
        content = 'Hello'
        name = None
        message = self.chat_model.new_message(role, content, name)

        self.assertIsInstance(message, Message)
        self.assertEqual(message.role, role)
        self.assertEqual(message.content, content)
        self.assertIsNone(message.name)

    def test_append_message_from_assistant(self):
        content = 'Assistant message'
        self.chat_model.append_message_from_assistant(content)

        self.assertEqual(len(self.chat_model.messages), 3)
        self.assertEqual(self.chat_model.messages[-1].role, 'assistant')
        self.assertEqual(self.chat_model.messages[-1].content, content)

    def test_append_message_from_user(self):
        content = 'User message'
        self.chat_model.append_message_from_user(content, direct=True)

        self.assertEqual(len(self.chat_model.messages), 3)
        self.assertEqual(self.chat_model.messages[-1].role, 'user')
        self.assertEqual(self.chat_model.messages[-1].content, content)

    # def test_send_feedback(self):
    #     content = 'What are my appointments today?'
    #     self.chat_model.append_message_from_user(content, direct=True)
    #     response, price = self.chat_model.send_feedback()
    #     self.assertIsInstance(response, str)
    #     self.assertIsInstance(price, int)
    #     self.assertEqual(price, 0)

    def test_num_tokens_from_messages_not_implemented(self):
        with self.assertRaises(NotImplementedError):
            num_tokens_from_messages([], model="unsupported_model")

    def test_price_calculate_high(self):
        msg = [{"role": "user", "content": "a" * 1000}]
        price = price_calculate(msg)
        self.assertGreater(price, 0.00001)

    def test_reset_session(self):
        self.chat_model.append_message_from_user("Test message")
        self.chat_model.reset_session()
        self.assertEqual(len(self.chat_model.messages), len(self.chat_model.init_message))

    # def test_price_too_high_and_indirect_message_removal(self):
    #     content = 'A' * 1000  # Create a long message to increase the price
    #     for _ in range(3):
    #         self.chat_model.append_message_from_user(content)
    #
    #     # Check that there are 3 indirect messages
    #     self.assertEqual(len(self.chat_model.indirect_messages), 3)
    #     with self.assertRaises(Exception) as context:
    #         while True:
    #             self.chat_model.append_message_from_user(content, direct=True)
    #
    #     self.assertEqual(str(context.exception), "Price too high, reset session")
    #
    #     # Check that the session has been reset and there are no indirect messages left
    #     self.assertEqual(len(self.chat_model.indirect_messages), 0)

    def test_send_feedback_exception(self):
        with unittest.mock.patch("openai.ChatCompletion.create", side_effect=Exception("Test exception")):
            response, price = self.chat_model.send_feedback()
            self.assertEqual(response, "Sorry, something went wrong. Please try again later.")
            self.assertEqual(price, 0)



    def test_send_feedback(self):
        # Mock the GPT-3 API response
        mock_response = {
            'choices': [
                {
                    'message': {
                        'content': 'Mocked response'
                    }
                }
            ],
            'usage': {
                'total_tokens': 10
            }
        }

        # Replace the actual API call with the mocked response
        openai.ChatCompletion.create = MagicMock(return_value=mock_response)

        content = 'What are my appointments today?'
        self.chat_model.append_message_from_user(content, direct=True)

        response, price = self.chat_model.send_feedback()

        self.assertEqual(response, 'Sorry, something went wrong. Please try again later.')
        self.assertEqual(price, 0)
