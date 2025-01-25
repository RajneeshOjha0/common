const db = require("../Database/db");
const {fetchTableData, insertData} = require("../Model/user")

const user = async (req, res) => {
  res.status(200).json({
    status: "true",
    message: "welcome",
    data: [
      { arr: "hello", mess: "world" },
      { arr: "hello", mess: "world" },
      { arr: "hello", mess: "world" },
      { arr: "hello", mess: "world" },
      { arr: "hello", mess: "world" },
    ],
  });
};

const user2 = async (req, res) => {
  res.status(200).json({
    status: "true",
    message: "welcome",
    data: [
      { arr: "hello", mess: "world" },
      { arr: "hello", mess: "world" },
    ],
  });
};

const userData = async (req, res) => {
    try {
      const results = await fetchTableData('projects', ['isDeleted=0']);
  
      const safeParseJSON = (data) => {
        try {
          return data ? JSON.parse(data) : null;
        } catch (e) {
          console.warn('Invalid JSON:', data);
          return null;
        }
      };
  
      const decodedResults = results.map((project) => {
        return {
          ...project,
          createdFrom: safeParseJSON(project.createdFrom),
          audio: safeParseJSON(project.audio),
          logo: safeParseJSON(project.logo),
          watermark: safeParseJSON(project.watermark),
          intro: safeParseJSON(project.intro),
          outro: safeParseJSON(project.outro),
          promo: safeParseJSON(project.promo),
          faceNarration: safeParseJSON(project.faceNarration),
          voiceClone: safeParseJSON(project.voiceClone),
          priority_set: safeParseJSON(project.priority_set),
          thumbnail: project.thumbnail
            ? Buffer.from(project.thumbnail).toString('base64')
            : null,
          log_file: project.log_file ? project.log_file.toString() : null,
        };
      });
  
      res.json(decodedResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  };

  const insertUserData = (req,res)=>{
    try{
        const payload  = req.body;
        console.log(payload);
        const data = {
            'name':payload.name,
            'email': payload.email,
            'password': payload.password,
        }
        console.log(data);
        const response =  res.json({"data":data});
        if(data){
            const response = insertData('users',data);
            if(response){
                res.status(200).json({message:'User inserted successfully',data:response})
            }else{
                res.status(500).json({message:'Failed to insert user'})
            }
        }
    }catch{
        console.error("Error in inserting data");
    }
    res.JSON(response);


  }
  
  
  

module.exports = { user, user2, userData ,insertUserData};
