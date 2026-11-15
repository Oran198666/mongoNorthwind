import { useForm } from "react-hook-form";
import "./sign-up.css";
import { UserModel } from "../../../models/user-model";
import { notify } from "../../../utils/notify";
import { userService } from "../../../services/user-service";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { appConfig } from "../../../utils/app-config";

export function SignUp() {

    const { register, handleSubmit } = useForm<UserModel>();
    const navigate = useNavigate();
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    async function send(user: UserModel) {
        try {
            if (!captchaToken) {
                notify.error("Please complete the CAPTCHA.");
                return;
            }
            user.captchaToken = captchaToken;
            await userService.register(user);
            notify.success("Welcome " + user.firstName);
            navigate("/home");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="SignUp">

            <Typography variant="h4" color="secondary">
                Register to Northwind
            </Typography>

            <form onSubmit={handleSubmit(send)}>

                <TextField label="First name" {...register("firstName")} fullWidth required />

                <TextField label="Last name" {...register("lastName")} fullWidth required />

                <TextField label="Email" type="email" {...register("email")} fullWidth required />

                <TextField label="Password" type="password" {...register("password")} fullWidth required />

                <FormControlLabel label="Send me promotional emails" control={<Checkbox />} />

                <ReCAPTCHA
                    sitekey={appConfig.recaptchaSiteKey}
                    onChange={(token) => setCaptchaToken(token)}
                />

                <ButtonGroup variant="contained" fullWidth>
                    <Button type="submit" color="primary">Sign In</Button>
                    <Button type="reset" color="secondary">Clear</Button>
                </ButtonGroup>

            </form>

        </div>
    );
}