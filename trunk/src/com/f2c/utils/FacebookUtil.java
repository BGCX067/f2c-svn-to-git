package com.f2c.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.mail.MessagingException;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * Set of Facebook Util
 * <p>
 * 2010 (c) nPlay Sdn Bhd
 * @author Lawrence Law
 */
public class FacebookUtil {
    
    private static Logger logger = LoggerFactory.getLogger(FacebookUtil.class);
    
    private FacebookUtil() {}

    /**
     * Parse Signed Request and get the JSONObject ONLY when Sig is Valid
     * @param signedRequest
     * @param secret
     * @return null if signedRequest is invalid
     */
    public static JSONObject parseSignedRequest(String signedRequest, String secret) {
    	if (signedRequest == null) return null;
        String[] list = signedRequest.split("\\.");
        if (list.length >= 2) {
            String encodedSig = list[0];
            String payload = list[1];
            
            try {
                logger.debug("encodedSig={}", encodedSig);
                JSONObject data = JSONObject.fromObject(new String(fbDecodeBase64(payload)));
                if (!"HMAC-SHA256".equalsIgnoreCase(data.getString("algorithm"))) {
                    logger.error("Unknown algorithm. Expected HMAC-SHA256, signedRequest={}", signedRequest);
                    return null;
                }
                
                if (verifySignedRequest(payload, encodedSig, secret)) {
                    //Only Return JSON when Sig is verified
                    logger.debug("Signed Requet verfied! signedRequest={}", signedRequest);
                    return data;
                
                } else {
                    logger.error("Invalid Signed Requet! signedRequest={}", signedRequest);
                }
                
            } catch (IOException e) {
                logger.error("Error Decoding Base64, signedRequest="+signedRequest, e);
            } catch (MessagingException e) {
                logger.error("Error Decoding Base64, signedRequest="+signedRequest, e);
            }
        }
        return null;
    }
    
    private static final String ALGORITHM_HMAC_SHA_256 = "HmacSHA256";
    
    /**
     * Check payload's integrity
     * @param payload
     * @param encodedSig
     * @param secret
     * @return
     */
    public static boolean verifySignedRequest(String payload, String encodedSig, String secret) {
        try {
            byte[] keyBytes = secret.getBytes("UTF-8");
            
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM_HMAC_SHA_256);
            Mac mac = Mac.getInstance(ALGORITHM_HMAC_SHA_256);
            mac.init(secretKeySpec);
            logger.debug("payload={}", payload);
            byte[] macBytes = mac.doFinal(payload.getBytes());
            
            String encodedMacBytes = fbEncodeBase64(macBytes);
            logger.debug("Encoded MacBytes={}", encodedMacBytes);
            return encodedSig.equals(encodedMacBytes);
            
        } catch (NoSuchAlgorithmException e) {
            logger.error("Unable to get HmacsSHA256 instance", e);
        } catch (InvalidKeyException e) {
            logger.error("Invalid Key for HmacsSHA256", e);
        } catch (UnsupportedEncodingException e) {
            logger.error("Error Getting Bytes Array, secret="+secret, e);
        }
        return false;
    }
    
    /**
     * Facebook way of encoding base64 for sig
     * @param bytes
     * @return
     */
    private static String fbEncodeBase64(byte[] bytes) {
        String encodedMacBytes = new BASE64Encoder().encode(bytes);
        logger.debug("Fresh Encoded={}", encodedMacBytes);
        
        encodedMacBytes = encodedMacBytes.replaceAll("\\+", "-");
        encodedMacBytes = encodedMacBytes.replaceAll("/", "_");
        if (encodedMacBytes.endsWith("=")) {
            encodedMacBytes = encodedMacBytes.substring(0, encodedMacBytes.length()-1);
        }
        return encodedMacBytes;
    }
    
    /**
     * Facebook way of decoding base64
     * @param encoded
     * @return
     * @throws IOException
     * @throws MessagingException
     */
    private static byte[] fbDecodeBase64(String encoded) throws IOException, MessagingException {
        String _encoded = encoded.replaceAll("-", "+");
        _encoded = _encoded.replaceAll("_", "/");
        logger.debug("encoded={}", _encoded);
        return new BASE64Decoder().decodeBuffer(_encoded);
    }
}
