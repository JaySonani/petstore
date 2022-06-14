const axios = require('axios');
const { assert } = require('joi');

// test case for add pet
test('add pet', async () => {

    let response;
    var testBody = JSON.stringify({
        "id": 21234,
        "category": {
            "id": 0,
            "name": "string"
        },
        "name": "doggie",
        "photorls": [
            "string"
        ],
        "tags": [
            {
                "id": 0,
                "name": "string"
            }
        ],
        "status": "available"
    });

    var config = {
        method: 'post',
        url: 'https://38wy7jtai8.execute-api.us-east-1.amazonaws.com/pet',
        headers: {
            'Content-Type': 'application/json'
        },
        data: testBody
    };
    try {
        const res = await axios(config);
        expect(res.status).toBe(200)
        expect(res.data).toEqual(JSON.parse(testBody))
    } catch (error) {
        expect(error.response.status).toBe(405)
        expect(error.response.data.message).toBe("Invalid input")
    }


    // .then(function (res) {
    //     // console.log(res.data, "data====", res);
    //     expect(res.status).toBe(200)
    //     expect(res.data).toEqual(JSON.parse(testBody))
    // })
    // .catch(function (error) {
    //     // console.log(error.response.data.message, "catch====", error.response.status);

    // });
}
)

