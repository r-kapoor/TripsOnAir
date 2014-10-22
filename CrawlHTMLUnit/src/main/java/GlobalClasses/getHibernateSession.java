package GlobalClasses;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class getHibernateSession {

	public static Session getHibernateSession()
	{
		SessionFactory sessionFactory;
		try {
    	    Configuration conf = new Configuration();
    	    conf.addResource("com/hibernate/RailwayStation.hbm.xml").addResource("com/hibernate/RailwayTimetable.hbm.xml");
    	    sessionFactory = conf.configure("com/hibernate/hibernate.cfg.xml").buildSessionFactory();
        } catch (Throwable ex) {
            System.err.println("SessionFactory creation failed" + ex);
            throw new ExceptionInInitializerError(ex);
        }

		Session session = null;
		session = sessionFactory.openSession();	
			return session;
	}
	
	
}
