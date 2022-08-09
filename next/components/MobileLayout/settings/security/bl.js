import { useContext, useEffect } from "react";
import AppContext from "../../../../lib/AppContext";
import axios from "axios";
import useState from "react-usestateref";

const bl = () => {
  const { user, setTriggerReAuth, throwMessage } = useContext(AppContext);

  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleChange = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "rePassword":
        setRePassword(e.target.value);
        break;
    }
  };

  const checkPassword = (e) => {
    if (password === rePassword && password && rePassword) {
      handleSave(e, "password");
    } else {
      throwMessage("error", "Password does not match", 3000);
    }
  };

  const handleSave = (e, value) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
          user.role === "model" ? "model" : "client"
        }/update/${value === "password" ? "password" : "email"} `,
        value === "password"
          ? { password: password }
          : { email: email, role: user.role, srcEmail: user.email }
      )
      .then((res) => {
        value === "password" ? setPassword("") : null;
        value === "password" ? setRePassword("") : null;
        throwMessage("success", "Updated", 3000);
        setTriggerReAuth(true);
 
      })
      .catch((error) => {
        throwMessage("error", error.response.data.message, 3000);
      });
  };

  return {
    email,
    handleChange,
    password,
    rePassword,
    checkPassword,
    handleSave,
    user,
  };
};

export default bl;
