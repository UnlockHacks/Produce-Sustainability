
const fetchDatabaseData = async () => {
  try {
    const res = await axios.get('/store_name');
    return res.data;
  } catch (e) {
    throw e;
  }
  console.log(res);
  // await fetch("/store_name",{
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         data: {
  //           //data to send here
  //         }
  //       }) 
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         //do stuff w/ result
          
  //       })
}



//fetchDatabaseData();