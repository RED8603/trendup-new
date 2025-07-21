
import { useAppKit } from "@reown/appkit/react";
import ButtonBorder from "../ButtonBorder";

const ConnectButton = () => {
     const { open  } = useAppKit();

    return (
        <ButtonBorder
            className="hvr-bounce-to-right-sign"
            sx={{ textTransform: "capitalize", fontSize: "14px" }}
            onClick={open}
        >
            connect
        </ButtonBorder>
    );
};

export default ConnectButton;
