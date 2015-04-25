package fontenotsquad.stablestudy;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Config;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RadioGroup;
import android.widget.Toast;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.Locale;

import butterknife.ButterKnife;
import butterknife.InjectView;
import butterknife.OnClick;


public class AddRoom extends ActionBarActivity {



    public static final String TAG = AddRoom.class.getSimpleName();
    private String buildingName;
    private int roomNumber;
    private double longitude;
    private double latitude;
    private int classroom;
    private int outdoor;
    private int open_space;
    private int study_room;
    private int floor;
    private int chairs;
    private int computers;
    private int whiteboards;
    private int projectors;
    private int printers;
    private File image;
    private LocationManager locationManager;
    private Location location;
    private Context context;


    @InjectView(R.id.addBuild)
    EditText addBuild;
    @InjectView(R.id.addRNum)
    EditText addRNum;
    @InjectView(R.id.addFloor)
    EditText addFloor;
    @InjectView(R.id.addChairs)
    EditText addChairs;
    @InjectView(R.id.addSpace)
    Button addSpace;
    @InjectView(R.id.addType)
    RadioGroup addType;
    @InjectView(R.id.takePic)
    Button takePic;
    @InjectView(R.id.projBox)
    CheckBox projBox;
    @InjectView(R.id.printerBox)
    CheckBox printerBox;
    @InjectView(R.id.wbBox)
    CheckBox wbBox;
    @InjectView(R.id.computerBox)
    CheckBox compBox;
    @InjectView(R.id.thumbnail)
    ImageView thumbnail;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_room);
        ButterKnife.inject(this);
        latitude = 32.7767; //default values
        longitude = 96.7970;
        addType.check(R.id.classroomButton);
        LocationManager locationManager = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
        location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);


    }



    @OnClick(R.id.addSpace)
    void addSpace(View view){
        if (checkValidInput()){
            buildingName = addBuild.getText().toString();
            roomNumber = Integer.parseInt(addRNum.getText().toString());
            floor = Integer.parseInt(addFloor.getText().toString());
            chairs = Integer.parseInt(addChairs.getText().toString());
            if (compBox.isChecked()){
                computers = 1;
            }
            else
                computers = 0;
            if (printerBox.isChecked())
                printers = 1;
            else
                printers = 0;
            if (wbBox.isChecked())
                whiteboards = 1;
            else
                whiteboards = 0;
            if (projBox.isChecked())
                projectors = 1;
            else
                projectors = 0;



            int selectedId = addType.getCheckedRadioButtonId();
            if(selectedId == R.id.classroomButton) {
                radioValueReset();
                classroom = 1;
            }
            else if (selectedId == R.id.outsideButton) {
                radioValueReset();
                outdoor = 1;
            }
            else if (selectedId == R.id.openButton) {
                radioValueReset();
                open_space = 1;

            }
            else {
                radioValueReset();
                study_room = 1;

            }

            latitude = location.getLatitude();
            longitude = location.getLongitude();
            Log.v(TAG, latitude + "");
            Log.v(TAG, longitude + "");
            uploadRoom();
        }
    }


    @OnClick(R.id.takePic)
    void takePicture(View view) {
        Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        File f = new File(android.os.Environment.getExternalStorageDirectory(), "temp.jpg");
        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(f));

        startActivityForResult(cameraIntent, 1555);
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode != 1555){
            return;
        }
        File f = new File(Environment.getExternalStorageDirectory().toString());
        for (File temp : f.listFiles()) {
            if (temp.getName().equals("temp.jpg")) {
                f = temp;
                break;
            }
        }
        try {
            Bitmap bitmap;
            BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();

            bitmap = BitmapFactory.decodeFile(f.getAbsolutePath(),
                    bitmapOptions);

            thumbnail.setImageBitmap(bitmap);

            String path = android.os.Environment
                    .getExternalStorageDirectory()
                    + File.separator
                    + "Phoenix" + File.separator + "default";

            f.delete();
            OutputStream outFile = null;
            image = new File(path, String.valueOf(System.currentTimeMillis()) + ".jpg");
            try {
                outFile = new FileOutputStream(image);
                bitmap.compress(Bitmap.CompressFormat.JPEG, 85, outFile);
                outFile.flush();
                outFile.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private boolean checkValidInput(){
        if(addBuild.getText().length() < 3) {
            Toast.makeText(this, "Building name must be > 3 chars", Toast.LENGTH_LONG).show();
            return false;
        }
        if(addFloor.getText().toString().equals("")){
            Toast.makeText(this, "No Floor Entered", Toast.LENGTH_LONG).show();
            return false;
        }
        if(addRNum.getText().toString().equals("")){
            Toast.makeText(this, "Needs Room number", Toast.LENGTH_LONG).show();
            return false;
        }
        if(addChairs.getText().toString().equals("")){
            Toast.makeText(this, "Specify Chairs", Toast.LENGTH_LONG).show();
            return false;
        }



        return true;
    }

    private void radioValueReset(){
        classroom = 0;
        open_space = 0;
        study_room = 0;
        outdoor = 0;
    }

    private void uploadRoom(){



    }



}