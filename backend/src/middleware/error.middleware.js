const errorMiddleware = async(err, req, res, next)=>{
    const status = err.status || 500;
    const message = err.message || "Bad Request";

    return res.status(status).json({
        success: "fail",
        message: message
    });
}

export default errorMiddleware;