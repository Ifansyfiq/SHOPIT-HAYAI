// create token and save in the cookie
export default (user, statusCode, res) => {

    // create JWT token
    const token = user.getJwtToken()

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000 // convert days to milliseconds
        ),
        httpOnly: true // cookie can't be accessed by the browser
    };

    res.status(statusCode).cookie("token", token, options).json({
        token,
    });
};