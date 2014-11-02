// default package
// Generated Oct 14, 2014 11:08:41 PM by Hibernate Tools 3.4.0.CR1

import java.util.Date;

/**
 * WeatherId generated by hbm2java
 */
public class WeatherId implements java.io.Serializable {

	private int cityId;
	private float minTemp;
	private float maxTemp;
	private float humidity;
	private String condition;
	private Date date;

	public WeatherId() {
	}

	public WeatherId(int cityId, float minTemp, float maxTemp, float humidity,
			String condition, Date date) {
		this.cityId = cityId;
		this.minTemp = minTemp;
		this.maxTemp = maxTemp;
		this.humidity = humidity;
		this.condition = condition;
		this.date = date;
	}

	public int getCityId() {
		return this.cityId;
	}

	public void setCityId(int cityId) {
		this.cityId = cityId;
	}

	public float getMinTemp() {
		return this.minTemp;
	}

	public void setMinTemp(float minTemp) {
		this.minTemp = minTemp;
	}

	public float getMaxTemp() {
		return this.maxTemp;
	}

	public void setMaxTemp(float maxTemp) {
		this.maxTemp = maxTemp;
	}

	public float getHumidity() {
		return this.humidity;
	}

	public void setHumidity(float humidity) {
		this.humidity = humidity;
	}

	public String getCondition() {
		return this.condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	public Date getDate() {
		return this.date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof WeatherId))
			return false;
		WeatherId castOther = (WeatherId) other;

		return (this.getCityId() == castOther.getCityId())
				&& (this.getMinTemp() == castOther.getMinTemp())
				&& (this.getMaxTemp() == castOther.getMaxTemp())
				&& (this.getHumidity() == castOther.getHumidity())
				&& ((this.getCondition() == castOther.getCondition()) || (this
						.getCondition() != null
						&& castOther.getCondition() != null && this
						.getCondition().equals(castOther.getCondition())))
				&& ((this.getDate() == castOther.getDate()) || (this.getDate() != null
						&& castOther.getDate() != null && this.getDate()
						.equals(castOther.getDate())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + this.getCityId();
		result = 37 * result + (int) this.getMinTemp();
		result = 37 * result + (int) this.getMaxTemp();
		result = 37 * result + (int) this.getHumidity();
		result = 37 * result
				+ (getCondition() == null ? 0 : this.getCondition().hashCode());
		result = 37 * result
				+ (getDate() == null ? 0 : this.getDate().hashCode());
		return result;
	}

}