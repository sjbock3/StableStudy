package fontenotsquad.stablestudy;

/**
 * Created by Nick on 4/20/2015.
 */
public class RoomInfo {

    private boolean computers;
    private boolean printers;
    private boolean projectors;
    private boolean whiteboards;
    private boolean restricted;
    private String buildingName;
    private int roomNumber;
    private int floor;
    private double latitude;
    private double longitude;


    private String classType;
    private String rmSize;


    public RoomInfo() {
        computers = false;
        printers = false;
        projectors = false;
        whiteboards = false;
        restricted = false;
        buildingName = "none";
        roomNumber = 0;
        floor = 0;
        latitude = 0;
        longitude = 0;
    }

    public RoomInfo(boolean computers, boolean printers, boolean projectors, boolean whiteboards, boolean restricted, String buildingName, int roomNumber, String classType, String rmSize, int floor) {
        this.computers = computers;
        this.printers = printers;
        this.projectors = projectors;
        this.whiteboards = whiteboards;
        this.restricted = restricted;
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
        this.classType = classType;
        this.rmSize = rmSize;
        this.floor = floor;
    }

    public String getRmSize() {
        return rmSize;
    }

    public void setRmSize(int chairs) {
        if (chairs < 14) {
            rmSize = "small";
        } else if (chairs < 49) {
            rmSize = "medium";
        } else {
            rmSize = "large";
        }

    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(int classTypeInput) {

        if (classTypeInput == 1) {
            classType = "Classroom";
        } else if (classTypeInput == 2) {
            classType = "Outdoor";
        } else if (classTypeInput == 3) {
            classType = "Open Space";
        } else {
            classType = "Study Room";
        }

    }

    public String toString() {
        if (roomNumber == 0) {
            return buildingName + " Open Space";
        } else {
            return buildingName + " " + roomNumber;
        }


    }



    public boolean hasComputers() {
        return computers;
    }

    public void setComputers(int comp) {
        if (comp == 1)
            computers = true;
        else
            computers = false;


    }

    public boolean hasPrinters() {
        return printers;
    }

    public void setPrinters(int prints) {
        if (prints == 1)
            printers = true;
        else
            printers = false;
    }

    public boolean hasProjectors() {
        return projectors;
    }

    public void setProjectors(int projects) {

        if (projects == 1)
            projectors = true;
        else
            projectors = false;
    }

    public boolean hasWhiteboards() {
        return whiteboards;
    }

    public void setWhiteboards(int whites) {
        if (whites == 1)
            whiteboards = true;
        else
            whiteboards = false;
    }

    public boolean isRestricted() {
        return restricted;
    }

    public void setRestricted(int restricts) {
        if (restricts == 1)
            restricted = true;
        else
            restricted = false;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public int getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(int roomNumber) {
        this.roomNumber = roomNumber;
    }

    public void setFloor(int x) {
        floor = x;
    }
    public int getFloor() {
        return floor;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
}
