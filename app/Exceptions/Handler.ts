import ApiException from "./ApiException";
import { Handler as ExceptionHandler, HttpException } from "@lunoxjs/core";
import { Response } from "@lunoxjs/core/facades";
import { ValidationException } from "@lunoxjs/validation";

class Handler extends ExceptionHandler {
  protected dontReport = [ValidationException];

  register() {
    this.reportable(ApiException, (e) => {
      if (e.status >= 500) {
        console.log("API Error", e);
      }
    });

    this.renderable(ValidationException, (e)=>{
      return Response.make({
        message: e.message,
        errors: e.errors()
      }, e.status);
    });

    this.renderable(ApiException, (e) => {
      return Response.make(
        {
          message: e.message,
          status: e.status,
        },
        e.status,
      );
    });

    this.renderable(HttpException, (e) => {
      return Response.make(
        {
          message: e.message,
          status: e.getStatusCode(),
        },
        e.getStatusCode(),
      );
    });

    this.renderable(Error, (e) => {
      return Response.make(
        {
          message: env("APP_DEBUG") ? e.message : "Server Error",
          status: 500,
        },
        500,
      );
    });
  }
}

export default Handler;
