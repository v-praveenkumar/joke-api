import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
const Base_URL = "https://v2.jokeapi.dev/joke";

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/joke", async (req, res) => {
  let URL = ""; 
  const data = req.body;

  if (data.category === "Any") {
    if (data.blacklist) {
      const blacklist = Array.isArray(data.blacklist)
        ? data.blacklist.join(",")
        : data.blacklist;
      URL = `${Base_URL}/Any?blacklistFlags=${blacklist}`;
    } else {
      URL = `${Base_URL}/Any`;
    }
  } else {
    if (data["custom-category"]) {
      const category = Array.isArray(data["custom-category"])
        ? data["custom-category"].join(",")
        : data["custom-category"];
      if (data.blacklist) {
        const blacklist = Array.isArray(data.blacklist)
          ? data.blacklist.join(",")
          : data.blacklist;
        URL = `${Base_URL}/${category}?blacklistFlags=${blacklist}`;
      } else {
        URL = `${Base_URL}/${category}`; 
      }
    }
  }
  console.log(URL+"&type="+data.type);

  try {
    // Check if type exists and append it correctly
    const response = await axios.get(URL + (data.type ? `?type=${data.type}` : ""));
    if(data.type=="twopart")
    {
      res.render("index.ejs",{
        setup:response.data.setup,
        delivery:response.data.delivery
      })
    }else{
    res.render("index.ejs", {
      joke: response.data.joke,
    });
    }
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});