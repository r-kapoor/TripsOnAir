// default package
// Generated Oct 14, 2014 11:08:41 PM by Hibernate Tools 3.4.0.CR1

/**
 * CityConnectivityBetweenAirId generated by hbm2java
 */
public class CityConnectivityBetweenAirId implements java.io.Serializable {

	private int cityIdorigin;
	private int cityIddestination;
	private double connectivity;

	public CityConnectivityBetweenAirId() {
	}

	public CityConnectivityBetweenAirId(int cityIdorigin,
			int cityIddestination, double connectivity) {
		this.cityIdorigin = cityIdorigin;
		this.cityIddestination = cityIddestination;
		this.connectivity = connectivity;
	}

	public int getCityIdorigin() {
		return this.cityIdorigin;
	}

	public void setCityIdorigin(int cityIdorigin) {
		this.cityIdorigin = cityIdorigin;
	}

	public int getCityIddestination() {
		return this.cityIddestination;
	}

	public void setCityIddestination(int cityIddestination) {
		this.cityIddestination = cityIddestination;
	}

	public double getConnectivity() {
		return this.connectivity;
	}

	public void setConnectivity(double connectivity) {
		this.connectivity = connectivity;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof CityConnectivityBetweenAirId))
			return false;
		CityConnectivityBetweenAirId castOther = (CityConnectivityBetweenAirId) other;

		return (this.getCityIdorigin() == castOther.getCityIdorigin())
				&& (this.getCityIddestination() == castOther
						.getCityIddestination())
				&& (this.getConnectivity() == castOther.getConnectivity());
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + this.getCityIdorigin();
		result = 37 * result + this.getCityIddestination();
		result = 37 * result + (int) this.getConnectivity();
		return result;
	}

}
