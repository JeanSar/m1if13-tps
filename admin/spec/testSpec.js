const axios = require("axios");


describe("A suite", function() {
    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });
});

it('should ', async function () {
    const res = await axios.get("http://localhost:3376/admin/playerTtl?id=Toto");
    console.log(res)
    expect(res.data.ttl).toBe(10)
});