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

public class HtmlUnitWebClient extends getHibernateSession{

	public static HtmlPage WebClient(URL url) throws Exception{
	
	final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
	webClient.getOptions().setThrowExceptionOnScriptError(false);
	WebRequest request = new WebRequest(url);
	// Read the whole page
	HtmlPage page = webClient.getPage(request);
	int i=webClient.waitForBackgroundJavaScriptStartingBefore(5000);
	while (i > 2)
    {
        i = webClient.waitForBackgroundJavaScript(5000);
        System.out.println("i "+i);
        if ((i == 2))
        {
            break;
        }
        synchronized (page) 
        {
            System.out.println("Loading the page.....");
            page.wait(600);
        }
    }
	return page;	
	}
}