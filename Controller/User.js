const db = require("../Database/db");
const { generateToken, verifyToken } = require("../Middleware/JwtClient");
const bcrypt = require("bcrypt");
const {
  fetchTableData,
  insertData,
  validateLogin,
  updateTable,
} = require("../Model/user");

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
    const results = await fetchTableData("projects", ["isDeleted=0"]);

    const safeParseJSON = (data) => {
      try {
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.warn("Invalid JSON:", data);
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
          ? Buffer.from(project.thumbnail).toString("base64")
          : null,
        log_file: project.log_file ? project.log_file.toString() : null,
      };
    });

    res.json(decodedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const insertUserData = (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);
    const data = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    };
    console.log(data);
    const response = res.json({ data: data });
    if (data) {
      const response = insertData("users", data);
      if (response) {
        res
          .status(200)
          .json({ message: "User inserted successfully", data: response });
      } else {
        res.status(500).json({ message: "Failed to insert user" });
      }
    }
  } catch {
    console.error("Error in inserting data");
  }
  res.JSON(response);
};

const login = async (req, res) => {
  try {
    const payload = req.body;
    const email = payload.email;
    const password = payload.password;

    const user = await validateLogin("users", email, password);
    console.log(user);
    if (user.success == false) {
      const token = await generateToken(email);
      console.log(token);
      res.status(200).json({
        message: "Login successful",
        data: {
          token: token,
          userData: user,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.log(Error);
  }
};

const updateUser = async (req, res) => {
  const { email, password, name, id } = req.body;
  if (email || password) {
    const data = {
      email: email,
      // password: password,
      name: name,
    };
    try {
      const response = await updateTable("users", data, {
        id: id,
        email: email,
        isDeleted: 0,
      });

      if (response) {
        res
          .status(200)
          .json({ message: "User updated successfully", data: [] });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch {
      console.log("err");
    }
  } else {
    return res.status(403).json({ message: "Missing email or password" });
  }
};

const createUser = async (req, res) => {
  const { email, password, name } = req.body;
  if (email || password || name) {
    try {
      const newPassword  = await bcrypt.hash(password, 10);
      console.log(newPassword);
      const data = {
        email: email,
        password: newPassword,
        name: name,
      };
      const checkUser = fetchTableData("users", { email: email });
      if (checkUser[0]) {
        res.status(403).json({ status: false, message: "User already exists" });
      }
      const response = await insertData("users", data);
      if (response) {
        return response.json({
          status: true,
          message: "user created successfully",
        });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "User already exists" });
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    return res.status(403).json({ message: "Missing email, password or name" });
  }
};

module.exports = { user, user2, userData, insertUserData, login, updateUser ,createUser};
