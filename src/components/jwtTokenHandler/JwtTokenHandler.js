import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { useIdleTimer } from "react-idle-timer";
import CustomModal from "../customModal/CustomModal";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { refreshTokenURL } from "../../helpers/Urls";
import client from "../../helpers/Api";
import { setAccessAndRefreshTokenInSession } from "../../utils/cookies";

export default function JwtTokenHandler(props) {
  const { onLogout } = props;
  const [showIdealTimeLogoutConfirmation, setShowIdealTimeLogoutConfirmation] =
    useState(false);
  const [tokenRefreshFailed, setTokenRefreshFailed] = useState(false);

  const handleLogout = () => {
    setShowIdealTimeLogoutConfirmation(false);
    onLogout();
    // clearSession();
    // window.close();
  };

  const stayLogin = async () => {
    try {
      setShowIdealTimeLogoutConfirmation(false);
      let refrestTokenRes = await client.get(refreshTokenURL);
      setAccessAndRefreshTokenInSession(
        refrestTokenRes.accessToken,
        refrestTokenRes.refreshToken
      );
    } catch (error) {
      console.error("Error refreshing token:", error);
      setTokenRefreshFailed(true);
      setShowIdealTimeLogoutConfirmation(true);
    }
  };

  useEffect(() => {
    const refreshAccessToken = async () => {
      setShowIdealTimeLogoutConfirmation((showIdealTimeLogoutConfirmation) => {
        if (!showIdealTimeLogoutConfirmation) {
          stayLogin();
        }
        return showIdealTimeLogoutConfirmation;
      });
    };
    const refreshTokenTimer = setInterval(refreshAccessToken, 35 * 10 * 1000);
    return () => {
      clearInterval(refreshTokenTimer);
    };
  }, []);

  const onIdle = () => {
    setTokenRefreshFailed(false);
    setShowIdealTimeLogoutConfirmation(true);
  };
  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 30 * 15 * 1000,
  });

  return (
    <>
      <CustomModal
        open={showIdealTimeLogoutConfirmation}
        onClose={() => setShowIdealTimeLogoutConfirmation(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        title="Session Confirmation"
      >
        {tokenRefreshFailed ? (
          <>
            <DialogContent>
              <Stack
                width="100%"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                Your session has timed out. You must login again to continue.
              </Stack>
            </DialogContent>
            <DialogActions sx={{ margin: 2 }}>
              <Button variant="contained" onClick={() => handleLogout()}>
                Close
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent>
              <Stack
                width="100%"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                This session will expire shortly. Please click on the Extend
                button to extend your session.
              </Stack>
            </DialogContent>
            <DialogActions sx={{ margin: 2 }}>
              <Button variant="outlined" onClick={() => stayLogin()}>
                Extend
              </Button>
              <Button variant="contained" onClick={() => handleLogout()}>
                Logout
              </Button>
            </DialogActions>
          </>
        )}
      </CustomModal>
    </>
  );
}
