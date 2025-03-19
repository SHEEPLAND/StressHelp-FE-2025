const getData = async () => {
    try {
      // tehdään pyyntö HTTP GET
      const response = await fetch('http://127.0.0.1:3000/api/users');
      console.log(response);
      // muunnetaan json muotoon
      const data = await response.json();
      console.log(data);
      console.log(data.value);
    } catch (error) {
      console.error('Virhe:', error);
    }
  };
  
  export {getData};