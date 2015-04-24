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



    public RoomInfo() {
        computers = false;
        printers = false;
        projectors = false;
        whiteboards = false;
        restricted = false;
        buildingName = "none";
        roomNumber = 0;
    }

    public RoomInfo(boolean computers, boolean printers, boolean projectors, boolean whiteboards, boolean restricted, String buildingName, int roomNumber) {
        this.computers = computers;
        this.printers = printers;
        this.projectors = projectors;
        this.whiteboards = whiteboards;
        this.restricted = restricted;
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
    }

    public boolean hasComputers() {
        return computers;
    }

    public void setComputers(boolean computers) {
        this.computers = computers;
    }

    public boolean hasPrinters() {
        return printers;
    }

    public void setPrinters(boolean printers) {
        this.printers = printers;
    }

    public boolean hasProjectors() {
        return projectors;
    }

    public void setProjectors(boolean projectors) {
        this.projectors = projectors;
    }

    public boolean hasWhiteboards() {
        return whiteboards;
    }

    public void setWhiteboards(boolean whiteboards) {
        this.whiteboards = whiteboards;
    }

    public boolean isRestricted() {
        return restricted;
    }

    public void setRestricted(boolean restricted) {
        this.restricted = restricted;
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
}
