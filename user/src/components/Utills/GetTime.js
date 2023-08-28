import { useSelector } from "react-redux";
import FetchAvailableTimeSlots from "../server/FetchAvailableTimeSlots";
const GetTime = ({restaurant, date = new Date(), time = new Date(), resPage = false, serviceId = "1111"}) =>{

	let result = []
    let hour = time.getHours();
    let minutes = time.getMinutes();

	const availableSlots = []

	const addTime = (current_hour_minutes, condition) => {
		let new_time = new Date(0,0,0, current_hour_minutes[0], current_hour_minutes[1])
		// turn the 30 minutes to an hour
		new_time = new_time.setMinutes(condition)
		new_time = new Date(new_time)
		current_hour_minutes[0] = new_time.getHours()
		current_hour_minutes[1] = new_time.getMinutes()
	}

    const checkAvailableHours = (timeFrames, hours, minutes, res) =>{
		let iter = 3
		if (res) iter = 5
		if (minutes > 30) { hours += 1; minutes = 0}
		if (minutes < 30 && minutes !== 0) minutes = 30
		if (res && hours > 9) {hours -= 1}
		const current_hour_minutes = [hours, minutes]

		for (let i = 0; i < iter; i++){
			while (current_hour_minutes[0] < 23){
				if (parseInt(timeFrames[current_hour_minutes[0]]) >= parseInt(restaurant?.capacity)){
					if (current_hour_minutes[1] === 30) {
						addTime(current_hour_minutes, 60)
					} else {
						addTime(current_hour_minutes, 30)
					}
				}
				else {
					// add the time to the available time slots
					availableSlots.push(`${current_hour_minutes[0]}:${current_hour_minutes[1] === 0 ? '00' : current_hour_minutes[1]}`)
					// increase the time by 30 minutes each time
					if (current_hour_minutes[1] === 30) {
						addTime(current_hour_minutes, 60)
					} else {
						addTime(current_hour_minutes, 30)
					}
					break
				}
			}
		}
    }
	const slots_dict = FetchAvailableTimeSlots(serviceId);
	// const slots_dict = {
	// 	"Wednesday, 2023-03-29 13:00:00": {
	// 		"available_slots": 5,
	// 		"time": "Wednesday, 2023-03-29 13:00:00",
	// 		"slot_ids": [
	// 			6,
	// 			7,
	// 			8,
	// 			9,
	// 			10
	// 		]
	// 	},
	// 	"Monday, 2023-03-27 17:00:00": {
	// 		"available_slots": 2,
	// 		"time": "Monday, 2023-03-27 17:00:00",
	// 		"slot_ids": [
	// 			15,
	// 			16
	// 		]
	// 	}
	// }
	var slots = []
	for (let key in slots_dict){
		const slot = slots_dict[key];

		const myslot = {
			date: slot.time,
			count: slot.available_slots,
			quota: slot.slot_ids
		}

		slots.push(myslot);
	}
	// const reservations = useSelector((state)=> Object.values(state.reservations))
    const filteredRes = slots.filter((res)=>
                    {   let resDate = new Date(res.date)
                        // resDate = new Date(resDate.getTime() + resDate.getTimezoneOffset() * 60000)
                        return (
                        (resDate.getDate() === date.getDate()) &&
                        (resDate.getMonth() === date.getMonth()) &&
                        (resDate.getFullYear() === date.getFullYear()))
                    })
	console.log("filteredRes",filteredRes);
    const timeFrames = {}
    // filteredRes.forEach((e)=> {
    //     let timeKey = (new Date("1970-01-01T" + e.time)).getHours()
    //     if (timeFrames[timeKey]){
    //         timeFrames[timeKey] += e.count
    //     }else{
    //         timeFrames[timeKey] = e.count
    //     }
    // })

	// if(resPage){
	// 	checkAvailableHours(timeFrames, hour, minutes, true)
	// 	result = availableSlots

	// } else {
	// 	checkAvailableHours(timeFrames, hour, minutes, false)
	// 	result = availableSlots
	// }
	filteredRes.forEach((e)=> {
		let resDate = new Date(e.date)
		let hour = resDate.getHours();
		let min = resDate.getMinutes();
		let time = `${hour}:${min === 0 ? '00' : min}`;
		let slot_id = e.quota[0]
		let obj = {'time':time,'slotid':slot_id}
		availableSlots.push(obj)

	})
	
	// result = availableSlots;
	if (result.length == 0) result = ["No available time"]
    return result
}

export default GetTime;