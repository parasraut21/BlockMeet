import "../styles/globals.css";
import type { AppProps } from "next/app";

import { SocketProvider } from "@/contexts/SocketContext";
import { UserProvider } from "@/contexts/UserContext";
import { GamesProvider } from "@/contexts/MeetContext";
import { ChatProvider } from "@/contexts/ChatContext";
// import { AccountProvider } from "@/contexts/AccountContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <AccountProvider>
      <UserProvider>
        <SocketProvider>
          <ChatProvider>
            <GamesProvider>
              <Component {...pageProps} />
            </GamesProvider>
          </ChatProvider>
        </SocketProvider>
      </UserProvider>
    // </AccountProvider>
  );
}

export default MyApp;
