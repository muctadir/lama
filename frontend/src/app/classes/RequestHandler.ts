import axios, { Axios } from 'axios';
import { environment } from 'environments/environment';

/**
 * @author Bartjan Henkemans
 * The RequestHandler offers three methods to get, post or patch data.
 */
export class RequestHandler {
  private axiosInstance: Axios;
  private sessionToken?: string;

  /**
   * Instantiates object with possible session token.
   * Constructor also prepares axiosInstance for requests.
   * @param sessionToken
   */
  constructor(sessionToken?: string | null) {
    /**
     * Set up axios instance
     */
    this.axiosInstance = axios.create({
      baseURL: environment.apiURL, // Environment variable
      timeout: 5000, // 5 second
      responseType: 'json', // We want JSON information back
      responseEncoding: 'utf8', // Default encoding
      maxRedirects: 0, // Our api does not have redirects - hence this is put at 0
    });

    if (sessionToken !== undefined && sessionToken !== null) {
      this.sessionToken = sessionToken;
    }
  }
  /**
   * Sends a get request to the path with the parameters which have been provided.
   * @param path : string, path where the resource is
   * @param params : object, object of parameters
   * @param auth : boolean, true means it will authenticate, false means it will not
   * @returns the promise of an object
   */
  public async get(path: string, params: {}, auth: boolean): Promise<any> {
    this.verifyAuthentication(auth);
    return this.axiosInstance
      .get(path, { params: params })
      .then((response: any) => {
        return response.data;
      })
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   * Sends a post request to the path with the parameters which have been provided.
   * @param path : string, path where the resource is
   * @param params : object, object of parameters
   * @param auth : boolean, true means it will authenticate, false means it will not
   * @returns the promise of an object
   */
  public async post(path: string, params: {}, auth: boolean): Promise<any> {
    this.verifyAuthentication(auth);
    return this.axiosInstance
      .post(path, { params: params })
      .then((response: any) => {
        return response.data;
      })
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   * Sends a patch request to the path with the parameters which have been provided.
   * @param path : string, path where the resource is
   * @param params : object, object of parameters
   * @param auth : boolean, true means it will authenticate, false means it will not
   * @returns the promise of an object
   */
  public async patch(path: string, params: {}, auth: boolean): Promise<any> {
    this.verifyAuthentication(auth);
    return this.axiosInstance
      .patch(path, { params: params })
      .then((response: any) => {
        return response.data;
      })
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   * Informally:
   * Method verifies if authentication is required:
   * 1. Authentication is required but not provided -> Throw
   * 2. Authentication is not required but provided -> true
   * 3. Authentication is not required nor provided -> Ok!
   * 4. Authentication is required and provided -> Ok
   */
  private verifyAuthentication(authenticationReq: boolean) {
    if (authenticationReq && this.sessionToken === undefined) {
      throw new Error(
        'The method requires a session token which was not provided during instantation.'
      );
    } else if (!authenticationReq && this.sessionToken !== undefined) {
      this.axiosInstance.defaults.headers.common['u_id_token'] = '';
      return true;
    } else if (!authenticationReq && this.sessionToken === undefined) {
      this.axiosInstance.defaults.headers.common['u_id_token'] = '';
      return true;
    } else if (authenticationReq && this.sessionToken !== undefined) {
      this.axiosInstance.defaults.headers.common['u_id_token'] =
        this.sessionToken;
      return true;
    }
    return false;
  }
}
