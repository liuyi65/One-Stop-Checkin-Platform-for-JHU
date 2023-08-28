import React, { useRef } from "react";
import logo from './logo.svg';
import './App.css';
//import ThemeProvider from 'react-bootstrap/ThemeProvider'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BusServerConnector from './ServerConnector';
import { useNavigate } from 'react-router-dom';
import userPic from "./assert/userPic.jpg";
import { message, Upload } from 'antd';
import './style.css'
import { Space, Tag } from "antd";
import { MAX_VERTICAL_CONTENT_RADIUS } from "antd/es/style/placementArrow";
const { CheckableTag } = Tag;
function Profile() {
    const [bid, setBid] = useState(-1)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [desc, setDesc] = useState("")
    const [showUploadSuccess, setShowUploadSuccess] = useState(0)
    const [showPicUploadSuccess, setShowPicUploadSuccess] = useState(0)
    const [busiPic, setBusiPic] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCate, setSelectedCate] = useState(-1);
    const [cateError, setCateError] = useState(false);


    const handleChange = (id, checked) => {
      if(checked){
        setCateError(false);
        setSelectedCate(id);
      }
      else{
        setCateError(true);
        setSelectedCate(-1);
      }

    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };
    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };
    const handleDescChange = (event) => {
        setDesc(event.target.value);
    };
    const handleSubmit = (event) => {
      event.preventDefault();
        async function submitInfo() {
          const connector = BusServerConnector.getInstance()
          const response1 = await connector.upload_business_info(name, phone, address, desc);
          console.log("select",selectedCate)
          const response2 = await connector.set_category(selectedCate);
          if(!cateError && response1 && response2 && showPicUploadSuccess == 1){
            setShowUploadSuccess(1);
            window.location.reload();
          }
          else{
            setShowUploadSuccess(2);
          }
        }
        submitInfo();
    }
    async function handleFileChange(event){
      let file = event.file.originFileObj;
      console.log('file', file)
      setBusiPic(URL.createObjectURL(file));
      let connector = BusServerConnector.getInstance()
      let res = await connector.set_business_image(file);
      console.log('pic', res);
      setShowPicUploadSuccess(res);
      // if (file.size > MAX_FILE_SIZE) {
      //   console.log('max', MAX_FILE_SIZE)
      //   setShowPicUploadSuccess(2);
      // }
      // else{
      //   setBusiPic(URL.createObjectURL(file));
      //   let connector = BusServerConnector.getInstance()
      //   let res = await connector.set_business_image(file);
      //   console.log('pic', res);
      //   setShowPicUploadSuccess(res);
      // }
    }
    useEffect(() => {
      const connector = BusServerConnector.getInstance()
      async function fetchBusinessInfo() {
        
        const busiInfo = await connector.get_business_info();
        console.log(busiInfo);
        setName(busiInfo.name);
        setAddress(busiInfo.address);
        setDesc(busiInfo.description);
        setPhone(busiInfo.phone);
        setBid(busiInfo.business_id);
        setSelectedCate(busiInfo.category_id);
        console.log('api',connector.api_key);
      }
      async function fetchBusinessImage() {

        const busiImage = await connector.get_business_image(bid);
        setBusiPic(busiImage);
        // if(busiImage==null){
        //   setBusiPic(userPic);
        // }
        // else{
        //   setBusiPic(busiImage);
        // }

      }
      async function fetchCategoryList() {
        const categories = await connector.get_categories();
        console.log('cate',categories);
        setCategories(categories);
      }
      fetchBusinessInfo();
      fetchBusinessImage();
      fetchCategoryList();

    }, [bid],[busiPic]);


    return (
        <div>

    <div className="breadcrumb-bar">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-12 col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page" style={{fontSize:'20px'}}>Company Profile</li>
              
              </ol>
            </nav>
            <h2 className="breadcrumb-title">Profile</h2>
          </div>
        </div>
      </div>
    </div>

        <div className="content">
          <div className="container-fluid">
            <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="col-md-7 col-lg-8 col-xl-9">
                <div className="card">
                  <div className="card-body">
                    {/* Profile Settings Form */}
                    <div className="col-12 col-md-12">
                      <div className="form-group">
                        <div className="change-avatar">
                          <div className="profile-img">
                            <img src={busiPic} alt="Bisiness Image" />
                          </div>
                          
                            <div className="upload-img">
                              <div style={{ minWidth:'280px',backgroundColor: "rgb(126,161,238)"}} className="change-photo-btn">
                                <Upload name="avatar"
                                            
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            onChange={handleFileChange}
                                            >
                                  <span><i className="fa fa-upload" /> Upload Business Photo</span>
                                </Upload>
                                {/* <input type="file" className="upload" /> */}
                              </div>
                              {showPicUploadSuccess == 1 && <div style={{fontWeight: 400, fontSize: "16px", minWidth: '120px'}}>Successfully Upload!</div>}
                              {showPicUploadSuccess == 2 && <div style={{fontWeight: 400, fontSize: "16px", minWidth: '120px'}}>Upload failed, please use pictures of size smaller than 1MB</div>}
                              <small className="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 1MB</small>
                            </div>
                          

                        </div>
                      </div>
                    </div>
                    <br ></br>
                    <form onSubmit={handleSubmit}>
                      <div className="row form-row">
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label>Company Name</label>
                              <input style = {{marginTop:'10px'}} type="text" className="form-control" placeholder="Update Company Name" value={name} onChange={handleNameChange} />
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label>Address</label>
                              <input style = {{marginTop:'10px'}} type="text" className="form-control" placeholder="Update Address" value={address} onChange={handleAddressChange} />
                            </div>
                          </div>
                          <div style={{marginTop:'10px'}}></div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label>Phone</label>
                              <input style = {{marginTop:'10px'}} type="text" className="form-control" placeholder="Update Phone" value={phone} onChange={handlePhoneChange} />
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label>Description</label>
                              <input style = {{marginTop:'10px'}} type="text" className="form-control" placeholder="Update Description" value={desc} onChange={handleDescChange} />
                            </div>
                          </div>
                          <div style={{marginTop:'10px'}}></div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label>Category</label>
                              <br ></br>
                              <div style={{marginTop:'10px'}}></div>
                              <Space size={[0, 8]} wrap>
                                {categories.map((cate) => (
                                  <CheckableTag
                                    key={cate.category_id}
                                    checked={selectedCate == cate.category_id}
                                    onChange={(checked) => handleChange(cate.category_id, checked)}
                                  >
                                    {cate.name}
                                  </CheckableTag>
                                ))}
                              </Space>
                              {cateError && <div style={{padding: '12px 30px', fontWeight: 600, fontSize: "16px", minWidth: '120px'}}>You must select one category!</div>}
                            </div>
                          </div>
                          <div> 

                              <button style={{marginTop:'10px', alignItems: 'left'}} type="submit" className="primary-button">Upload Changes</button>
                              {showUploadSuccess == 1 && <div style={{fontWeight: 400, fontSize: "16px", minWidth: '120px'}}>Successfully Upload!</div>}
                              {showUploadSuccess == 2 && <div style={{fontWeight: 400, fontSize: "16px", minWidth: '120px'}}>Upload failed, try again</div>}

                          </div>


                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
    );
  }
  
  export default Profile;