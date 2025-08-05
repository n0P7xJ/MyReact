import { createRoot } from 'react-dom/client'
import './index.css'
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {StrictMode} from "react";
import {AppWrapper} from "./components/common/PageMeta.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GOOGLE_AUTH_KEY} from "./env";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <AppWrapper>
                <Provider store={store}>
                    <GoogleOAuthProvider clientId={GOOGLE_AUTH_KEY}>
                        <App />
                    </GoogleOAuthProvider>
                </Provider>,
            </AppWrapper>
        </ThemeProvider>
    </StrictMode>,
)
