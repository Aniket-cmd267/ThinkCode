const axios = require('axios');

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63
  }
  return language[lang.toLowerCase()];
}

const submitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'true'
    },
    headers: {
      'x-rapidapi-key': '399441a3f3msh7cbd869b0d16040p1465b8jsne2000970e27e',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      submissions
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();

}


const waiting = async (timer) => {
  setTimeout(() => {
    return 1;
  }, timer);
}

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async (resultToken) => {

  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'true',
      fields: 'token,stdout,stderr,status,compile_output,source_code,stdin,time,memory'
    },
    headers: {
      'x-rapidapi-key': '399441a3f3msh7cbd869b0d16040p1465b8jsne2000970e27e',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }


  while (true) {

    const result = await fetchData();
    console.log("Current Statuses:", result.submissions.map(s => s.status?.description || s.status.id));
    const IsResultObtained = result.submissions.every((r) => r.status.id > 2);

    if (IsResultObtained){
      // result.submissions.forEach((sub,i) => {
      //   const actual= sub.stdout ? Buffer.from(sub.stdout, 'base64').toString('utf-8').trim() : '';
      //   const expected= sub.expected_output ? Buffer.from(sub.expected_output, 'base64').toString('utf-8').trim() : '';
      //   console.log(`Test Case ${i+1}`)
      //   console.log(`Actual : "${actual}"`)
      //   console.log(`Expected: ${expected}`)
      // })
      return result.submissions;
    }
    console.log("Not ready yet... sleeping.");
    await waiting(2000);
  }
}
module.exports = { getLanguageById, submitBatch, submitToken };