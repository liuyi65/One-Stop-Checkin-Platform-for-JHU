import { getAuth } from "firebase/auth";

export default class BusServerConnector {

    static instance = null

    constructor(){
      // this.host = "http://home.magicspica.com:5000/"
      this.host = "http://api.magicspica.com/"
      this.api_key = null
    }

    static getInstance(){
      if (this.instance == null){
        this.instance = new BusServerConnector()
      } 
      return this.instance
    }

    get_api_key(){
      return this.api_key
    }

    async set_api_key(token){
        this.api_key = null
        var raw = {
          "token":  token
          }
          var requestOptions = {
              method: 'POST',
              body: JSON.stringify(raw),
              redirect: 'follow',
              headers: {
                  "Content-Type": "application/json"
              }
          };
          
  
          var request = await fetch(this.host + "api/bus/api_key", requestOptions);
          // console.log("test!!!")
          // console.log(request)
          // console.log(await request.text())
          if (!request.ok){
            console.log("error")
            console.log(await request.text())
          }
          this.api_key = await request.text();
          
    }

   async get_services_with_all(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      //`${this.host}api/bus${this.api_key}services`
      console.log(`${this.host}api/bus/${this.api_key}/services`)
      
      const request = await fetch(`${this.host}api/bus/${this.api_key}/services`, requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
      }

      return await request.json();
   }



   async get_all_business() {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const request = await fetch(this.host + "api/businesses", requestOptions);
    if (!request.ok){
      console.log("error")
    } else {
        const result = await request.json()
        console.log(result)
        return result;
    }
    // console.log("test");
      // fetch(this.host + "api/businesses", requestOptions)
      // .then(response => response.text())
      // .then(result => {
      //   // console.log(result);
      //   callback(JSON.parse(result));
      // })
      // .catch(error => console.log('error', error));
  }
  
  async get_all_orders_by_service(service_id){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      service_id = parseInt(1);
      //`${this.host}api/bus${this.api_key}services`
      console.log(`${this.host}api/bus/${this.api_key}/${service_id}/orders`)
      
      const request = await fetch(`${this.host}api/bus/${this.api_key}/${service_id}/orders`, requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
      } else{
        console.log("service is get")
      }

      return await request.json();
   }


  async create_service(service_name, service_description, base_price, service_time) {
    const api_key = this.api_key; // You can retrieve the API key from the BusServerConnector class or from another source
    var raw = {
        "api_key": this.api_key,
        "service_name": service_name,
        "service_description": service_description,
        "service_price":  parseFloat(base_price),
        "service_time": []
    }

    for(let i in service_time){
        let time = service_time[i]
        const time_dict = {
            "weekday": time.weekday,
            "hour": parseInt(time.hour),
            "minute": parseInt(time.minute),
            "slots": parseInt(time.slots)
        }
        raw["service_time"].push(time_dict)
    }
    var requestOptions = {
        method: 'PUT',
        body: JSON.stringify(raw),
        redirect: 'follow',
        headers: {
            "Content-Type": "application/json"
        }
    };
    

    var request = await fetch(this.host + "api/bus/service", requestOptions)
    
    if (!request.ok){
      console.log("error")
      console.log(await request.text())
    } else {
        const result = await request.text()
        console.log(result)
    }
    return request.ok
  }

  
}