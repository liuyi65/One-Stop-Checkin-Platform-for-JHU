import {Button, Input, Space, Tag} from "antd";
import {MenuOutlined, SearchOutlined, TagOutlined} from "@ant-design/icons";
import {useState} from "react";
import record from "./Record";

const SearchBar = (props) => {

    const [tagList, setTagList] = useState(props.tags ?? [])

    return (
        <div
            style={{
                backgroundColor: "white",
                height: "120px",
                width: "800px",
                borderRadius: "20px",
                boxShadow: "0px 1px 3px",
                textAlign: "left"
            }}
        >
            <div style={{marginTop: 10, marginLeft: 16, fontSize: 16}}>
                &nbsp;{props.info}
            </div>
            <div style={{marginTop: 8, marginLeft: 16}}>
                <Space>
                    <div style={{width: 600, borderColor: "rgb(248, 180, 165)",}}>
                        <Input
                            size={"large"}
                            placeholder={props.placeholder}
                        />
                    </div>
                    <Button
                        icon={<SearchOutlined/>}
                        style={{
                            backgroundColor: "rgb(250, 105, 0)",
                            color: "white"
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        icon={<MenuOutlined/>}
                        style={{
                            backgroundColor: "rgb(250, 105, 0)",
                            color: "white"
                        }}
                    />
                </Space>
                <div style={{float: "right", marginRight: 150, marginTop: 8}}>
                    {tagList.map((value) => {
                        return (
                            <Tag icon={<TagOutlined/>} closable>
                                {value}
                            </Tag>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SearchBar
