import { removeCookies } from "cookies-next";

const handler = async (req, res) => {
  try {
    removeCookies("token", { req, res });
    removeCookies("client", { req, res });
    removeCookies("model", { req, res });
    res.status(200);
    res.end();
  } catch (error) {
    res.status(400).json(error);
  }
};

export default handler;
