package GlobalClasses;

import java.net.URL;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * 
 * @author rajat
 *
 */

public class HtmlUnitWebClient {

	public static HtmlPage WebClient(URL url) throws Exception{
	
	final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
	webClient.getOptions().setThrowExceptionOnScriptError(false);
	WebRequest request = new WebRequest(url);

	// Read the whole page
	HtmlPage page = webClient.getPage(request);
	return page;	
	}
}
