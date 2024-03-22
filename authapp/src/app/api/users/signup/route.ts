import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    //validation
    console.log(reqBody);

    //check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          error: "user already exists",
        },
        { status: 400 }
      );
    }
    //hased password
    const salt = await bcryptjs.genSalt(10);
    const hasedPassword = await bcryptjs.hash(password, salt);

    //save the password in db
    const newUser = new User({
      username,
      email,
      password: hasedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    //sending a mail : verification
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "user registered successfully",
      sucess: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
