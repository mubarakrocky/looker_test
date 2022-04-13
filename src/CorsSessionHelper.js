/*
  This file contains several methods to help with authentication.
  The SDK cannot call Looker unless it is initialized.
  This file authenticates the SDK by getting an authorization token.
*/
import { Looker40SDK } from "@looker/sdk";
import { AuthToken, BrowserTransport, DefaultSettings, ProxySession } from "@looker/sdk-rtl";


class PblSession extends ProxySession {

    // This is a placeholder for the fetchToken function. It is modified to make it useful later.
    fetchToken() {
        return fetch("");
    }

    activeToken = new AuthToken();
    constructor(settings, transport) {
        super(settings, '', transport || new BrowserTransport(settings));
    }

    // This function checks to see if the user is already authenticated
    isAuthenticated() {
        const token = this.activeToken;
        if (!(token && token.access_token)) return false;
        return token.isActive();
    }

    // This function gets a new token
    async getToken() {
        if (!this.isAuthenticated()) {
            const token = await this.fetchToken();
            const res = await token.json()
            const tokenResponse = res.data
            this.activeToken.setToken(tokenResponse);
        }
        return this.activeToken;
    }

    // This function authenticates a user, which involves getting a new token
    // It returns a modified object with a new authorization header.
    async authenticate(props) {
        const token = await this.getToken();
        if (token && token.access_token) {
            props.mode = "cors";
            delete props.credentials;
            props.headers = {
                Authorization: `Bearer ${this.activeToken.access_token}`
            };
        }
        return props;
    }
}

// This class sets the fetchToken to use the 'real' address of the backend server.
class PblSessionEmbed extends PblSession {
    jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJjb21wYW55X2lkIjoxfQ.xIfdtwopYGat2pnKDfaHGWMpwYTXUMyGDz66r1Le63g'
    fetchToken() {
        return fetch(
            // The token user is here set to be a Looker 'user1'
            // In real applications, you would pass the actual,
            // logged in user to the backend instead.
            // The backend would then handle assigning appropriate permissions to the user.
            `https://p0ah6i2uf0.execute-api.us-east-1.amazonaws.com/dev/analytics/auth_token?jwt_token=${this.jwtToken}`
        );
    }
}

// This creates a new session with the 'real' address used above
const session = new PblSessionEmbed({
    ...DefaultSettings,
    base_url: 'https://ordwaydev.cloud.looker.com'
});

// This exports the SDK with the authenticated session
export const looker40sdk = new Looker40SDK(session);