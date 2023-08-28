import { Button, Result } from 'antd';
import { Space } from 'antd';
import MainPage from "./MainPage"
import AddService from "./AddService"
import {Link} from 'react-router-dom' 

export default function App (){




return(
    <div>
        
        <Result
    status="success"
    title={<span style = {{ fontSize:'70px'}}>"Successfully Added Services"</span>}
    subTitle={<span style = {{ fontSize:'50px'}}>"Server configuration takes 1-5 minutes for adding"</span>}
    extra={[
    <Space size = "large">
        <Link to="/CompanyPage/MainPage">
            <Button type="primary" key="console" style={{ fontSize: '35px', padding: '12px 24px', height: 'auto', marginright:'40px'}}>
        Go back Main Page
            </Button>
        </Link>
        <Link to="/CompanyPage/AddService">
             <Button key="buy" style={{ fontSize: '35px', padding: '12px 24px', height: 'auto' }}>Add Service Again</Button>,
        </Link>
    </Space>
    ]}
  />
    </div>
)
}
