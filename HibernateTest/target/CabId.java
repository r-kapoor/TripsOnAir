// default package
// Generated Oct 14, 2014 11:08:41 PM by Hibernate Tools 3.4.0.CR1

/**
 * CabId generated by hbm2java
 */
public class CabId implements java.io.Serializable {

	private String operator;
	private String city;
	private int cityId;
	private int firstKm;
	private float firstKmRateDay;
	private float ratePerKmDay;
	private float waitingChargesPerMinDay;
	private float firstKmRateNight;
	private float ratePerKmNight;
	private float waitingChargesPerMinNight;
	private int minCharge;

	public CabId() {
	}

	public CabId(String operator, String city, int cityId, int firstKm,
			float firstKmRateDay, float ratePerKmDay,
			float waitingChargesPerMinDay, float firstKmRateNight,
			float ratePerKmNight, float waitingChargesPerMinNight, int minCharge) {
		this.operator = operator;
		this.city = city;
		this.cityId = cityId;
		this.firstKm = firstKm;
		this.firstKmRateDay = firstKmRateDay;
		this.ratePerKmDay = ratePerKmDay;
		this.waitingChargesPerMinDay = waitingChargesPerMinDay;
		this.firstKmRateNight = firstKmRateNight;
		this.ratePerKmNight = ratePerKmNight;
		this.waitingChargesPerMinNight = waitingChargesPerMinNight;
		this.minCharge = minCharge;
	}

	public String getOperator() {
		return this.operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getCity() {
		return this.city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public int getCityId() {
		return this.cityId;
	}

	public void setCityId(int cityId) {
		this.cityId = cityId;
	}

	public int getFirstKm() {
		return this.firstKm;
	}

	public void setFirstKm(int firstKm) {
		this.firstKm = firstKm;
	}

	public float getFirstKmRateDay() {
		return this.firstKmRateDay;
	}

	public void setFirstKmRateDay(float firstKmRateDay) {
		this.firstKmRateDay = firstKmRateDay;
	}

	public float getRatePerKmDay() {
		return this.ratePerKmDay;
	}

	public void setRatePerKmDay(float ratePerKmDay) {
		this.ratePerKmDay = ratePerKmDay;
	}

	public float getWaitingChargesPerMinDay() {
		return this.waitingChargesPerMinDay;
	}

	public void setWaitingChargesPerMinDay(float waitingChargesPerMinDay) {
		this.waitingChargesPerMinDay = waitingChargesPerMinDay;
	}

	public float getFirstKmRateNight() {
		return this.firstKmRateNight;
	}

	public void setFirstKmRateNight(float firstKmRateNight) {
		this.firstKmRateNight = firstKmRateNight;
	}

	public float getRatePerKmNight() {
		return this.ratePerKmNight;
	}

	public void setRatePerKmNight(float ratePerKmNight) {
		this.ratePerKmNight = ratePerKmNight;
	}

	public float getWaitingChargesPerMinNight() {
		return this.waitingChargesPerMinNight;
	}

	public void setWaitingChargesPerMinNight(float waitingChargesPerMinNight) {
		this.waitingChargesPerMinNight = waitingChargesPerMinNight;
	}

	public int getMinCharge() {
		return this.minCharge;
	}

	public void setMinCharge(int minCharge) {
		this.minCharge = minCharge;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof CabId))
			return false;
		CabId castOther = (CabId) other;

		return ((this.getOperator() == castOther.getOperator()) || (this
				.getOperator() != null && castOther.getOperator() != null && this
				.getOperator().equals(castOther.getOperator())))
				&& ((this.getCity() == castOther.getCity()) || (this.getCity() != null
						&& castOther.getCity() != null && this.getCity()
						.equals(castOther.getCity())))
				&& (this.getCityId() == castOther.getCityId())
				&& (this.getFirstKm() == castOther.getFirstKm())
				&& (this.getFirstKmRateDay() == castOther.getFirstKmRateDay())
				&& (this.getRatePerKmDay() == castOther.getRatePerKmDay())
				&& (this.getWaitingChargesPerMinDay() == castOther
						.getWaitingChargesPerMinDay())
				&& (this.getFirstKmRateNight() == castOther
						.getFirstKmRateNight())
				&& (this.getRatePerKmNight() == castOther.getRatePerKmNight())
				&& (this.getWaitingChargesPerMinNight() == castOther
						.getWaitingChargesPerMinNight())
				&& (this.getMinCharge() == castOther.getMinCharge());
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getOperator() == null ? 0 : this.getOperator().hashCode());
		result = 37 * result
				+ (getCity() == null ? 0 : this.getCity().hashCode());
		result = 37 * result + this.getCityId();
		result = 37 * result + this.getFirstKm();
		result = 37 * result + (int) this.getFirstKmRateDay();
		result = 37 * result + (int) this.getRatePerKmDay();
		result = 37 * result + (int) this.getWaitingChargesPerMinDay();
		result = 37 * result + (int) this.getFirstKmRateNight();
		result = 37 * result + (int) this.getRatePerKmNight();
		result = 37 * result + (int) this.getWaitingChargesPerMinNight();
		result = 37 * result + this.getMinCharge();
		return result;
	}

}