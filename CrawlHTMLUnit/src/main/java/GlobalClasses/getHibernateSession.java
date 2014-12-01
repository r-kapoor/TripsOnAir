package GlobalClasses;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.omg.CosNaming.NamingContextExtPackage.AddressHelper;

public class getHibernateSession {

	public static SessionFactory getHibernateSessionFactory(String []resources)
	{
		SessionFactory sessionFactory;
		try {
    	    Configuration conf = new Configuration();
    	    for(int i=0; i < resources.length; i++)
    	    {
    	    	conf.addResource(resources[i]);
    	    }
    	    //conf.addResource("com/hibernate/RailwayStation.hbm.xml").addResource("com/hibernate/RailwayTimetable.hbm.xml").addResource("com/hibernate/Trains.hbm.xml");
    	    sessionFactory = conf.configure("com/hibernate/hibernate.cfg.xml").buildSessionFactory();
        } catch (Throwable ex) {
            System.err.println("SessionFactory creation failed" + ex);
            throw new ExceptionInInitializerError(ex);
        }

		return sessionFactory;
		//Session session = null;
		//session = sessionFactory.openSession();
	}
	
	
	public static Session getHibernateSession(SessionFactory sessionFactory)
	{
		return sessionFactory.openSession();
	}
	
}

