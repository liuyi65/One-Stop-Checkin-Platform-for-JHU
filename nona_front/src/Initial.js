function threeAndFour(calculation){
  calculation(3, 4)
  
}

function determineCalculation(v){
  if(v == 1){
    calculation = (a,b) => {return a+b}
  } else {
    calculation = (a,b) => {return a-b}
  }
  return calculation
}

(event) => {
  return 3
}

