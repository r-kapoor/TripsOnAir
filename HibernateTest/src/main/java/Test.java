import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;






public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//org.hibernate.cfg.AnnotationConfiguration cfg = new AnnotationConfiguration();
		//SessionFactory sf = cfg.configure("RailwayStation").buildSessionFactory();
		
		SessionFactory sessionFactory;
	    
	        try {
	    	    Configuration conf = new Configuration();
	    	    //conf.addClass(RailwayStation.class);
	    	    conf.addResource("RailwayStation.hbm.xml");
	    	    sessionFactory = conf.configure().buildSessionFactory();
	            //sessionFactory = new Configuration().configure()
	              //      .buildSessionFactory();
	        } catch (Throwable ex) {
	            System.err.println("SessionFactory creation failed" + ex);
	            throw new ExceptionInInitializerError(ex);
	        }
		

		Session session = null;
		Transaction tr = null;
		
		RailwayStation rstation = new RailwayStation();
		rstation.setStationCode("LKO");
		rstation.setStationName("Lucknow");
		
		session = sessionFactory.openSession();

		// create a transaction

		tr = session.beginTransaction();

		// save using the session

		session.save(rstation);

		session.flush();

		tr.commit();
		

	}

}
