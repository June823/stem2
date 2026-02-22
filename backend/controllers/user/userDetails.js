const userModel = require("../../models/userModel");

async function userDetailsController(req, res) {
  try {
    const user = await userModel.findById(req.userId);

    return res.status(200).json({
      data: user,
      success: true,
      error: false,
      message: "User details",
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message,
      success: false,
      error: true,
    });
  }
}

module.exports = userDetailsController;
