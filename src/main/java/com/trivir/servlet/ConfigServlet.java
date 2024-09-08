package com.trivir.servlet;


/*
 * 	Date        Issue ID        Desciption
 *	08/26/2022  AP175124        UE-210114-WFC Multi-factor authentication in SSO
 */

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.Properties;

public class ConfigServlet extends HttpServlet {

    private static final String RETURN_URL_KEY = "returnUrl";
    private static final String AM_URL_KEY = "forgerockAMUrl";
    private static final String REALM_PATH_KEY = "realmPath";
    private static final String FILE_PATH_KEY = "filePath";
    // AP175124 Start
    private static final String PROPERTY_FILE = "propertyFile"; 
    private static final String WISH_HOST = "wishHost";
    private static final String ACCOUNT_SERVICE_REST_ENDPOINT = "accountServiceRestEndpoint";
    private static final String AUDIT_SERVICE_REST_ENDPOINT = "auditServiceRestEndpoint";
    // AP175124 End

    private Path pathToFile;
    private String returnUrl;
    private String amUrl;
    private String realmPath;
    // AP175124 Start
    private String wishHost;
    private String accountServiceRestEndpoint;
    private String auditServiceRestEndpoint;
    // AP175124 End
    
    private FileInformation fileInformation;
    private String file;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
       
        // AP175124 Start
       /* returnUrl = config.getServletContext().getInitParameter(RETURN_URL_KEY);
        amUrl = config.getServletContext().getInitParameter(AM_URL_KEY);
        realmPath = config.getServletContext().getInitParameter(REALM_PATH_KEY);*/
        
        Properties property = loadPropertyFile(config.getInitParameter(PROPERTY_FILE));
        
        returnUrl = property.getProperty(RETURN_URL_KEY);
        amUrl = property.getProperty(AM_URL_KEY);
        realmPath = property.getProperty(REALM_PATH_KEY);
        wishHost = property.getProperty(WISH_HOST);
        accountServiceRestEndpoint = property.getProperty(ACCOUNT_SERVICE_REST_ENDPOINT);
        auditServiceRestEndpoint = property.getProperty(AUDIT_SERVICE_REST_ENDPOINT);
        
        // AP175124 End 
        
        String filePath = config.getInitParameter(FILE_PATH_KEY);
        pathToFile = Paths.get(getServletContext().getRealPath("/"), filePath);
        if (!Files.exists(pathToFile)) {
            throw new ServletException(String.format("Unable to find login file %s.", pathToFile.toAbsolutePath()));
        }
        loadFile();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        FileInformation currentInformation = new FileInformation(pathToFile);
        if (!fileInformation.equals(currentInformation)) {
            loadFile();
        }
        String responseBody = String.format(file, returnUrl, amUrl, realmPath, wishHost, accountServiceRestEndpoint, auditServiceRestEndpoint); // AP175124
        response.setStatus(200);
        response.setContentType("text/html");
        response.setContentLength(responseBody.getBytes().length);
        ServletOutputStream responseStream = response.getOutputStream();
        responseStream.print(responseBody);
        responseStream.flush();
    }

    private synchronized void loadFile() throws ServletException {
        try {
            fileInformation = new FileInformation(pathToFile);
            file = new String(Files.readAllBytes(pathToFile));
        } catch (IOException e) {
            throw new ServletException("Unable to load the file.", e);
        }
    }

    private static class FileInformation {

        private final long fileSize;
        private final FileTime fileLastModified;

        private FileInformation(Path path) throws IOException {
            this.fileSize = Files.size(path);
            this.fileLastModified = Files.getLastModifiedTime(path);
        }

        public boolean equals(Object o) {
            if (o instanceof FileInformation) {
                FileInformation other = (FileInformation)o;
                return this.fileLastModified.equals(other.fileLastModified) && this.fileSize == other.fileSize;
            } else {
                return false;
            }
        }
    }
    
    // AP175124  Start
    /**
     * Performs disk read for property file retrieval.
     *
     * @param propFile
     *            java.lang.String
     * @return java.util.Properties
     * @throws Exception
     */
    public Properties loadPropertyFile(final String propFile) throws ServletException {
	Properties properties = null;
	InputStream inputStream = null;
	try {
	    inputStream = new FileInputStream(propFile);
	    BufferedReader br = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
	    properties = new Properties();
	    properties.load(br);
	} catch (final Exception e) {
	    throw new ServletException("Unable to find property file: " + propFile
		    + ". Make certain that it is in the CLASSPATH.");
	} finally {
	    if (inputStream != null) {
		try {
		    inputStream.close();
		} catch (final Exception e) {
		    throw new ServletException("Unable to close the Input Stream: " + propFile);
		}
	    }
	}
	return properties;
    }
    // AP175124 End
}
