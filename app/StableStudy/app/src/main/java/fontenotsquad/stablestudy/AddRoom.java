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

import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.FormEncodingBuilder;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONException;
import org.json.JSONObject;

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
    private Uri imageURL;
    private AppLocationService alocserv;
    private boolean uploadSuccessful;

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
        longitude = -96.7970;
        addType.check(R.id.classroomButton);
        alocserv = new AppLocationService(this);




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
            location = alocserv.getLocation(LocationManager.NETWORK_PROVIDER);
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

            //thumbnail.setImageBitmap(bitmap);


            image = f;
            imageURL = Uri.fromFile(image);
            thumbnail.setImageURI(imageURL);
//            Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
//            mediaScanIntent.setData(x);
//            this.sendBroadcast(mediaScanIntent);

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
        if(imageURL == null){
            Toast.makeText(this, "Take a picture first", Toast.LENGTH_LONG).show();
            Log.v(TAG, "IMAGE WAS NULL");
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
        OkHttpClient client = new OkHttpClient();
        RequestBody formbody = new FormEncodingBuilder()
                .add("buildingName", buildingName).add("roomNumber", roomNumber + "")
                .add("longitude", longitude + "").add("latitude", latitude + "")
                .add("classroom", classroom + "").add("outdoor", outdoor + "")
                .add("open_space", open_space + "").add("study_room", study_room + "")
                .add("floor", floor + "").add("chairs", chairs + "").add("computers", computers + "")
                .add("whiteboards", whiteboards + "").add("projectors", projectors + "")
                .add("printers", printers + "").add("restricted", "0").build();

        RequestBody m = new MultipartBuilder().type(MultipartBuilder.FORM)
                .addPart(formbody).addFormDataPart("pictureurl", "temp.jpg", RequestBody.create(MediaType.parse("image/jpg"), image))
                .build();

        RequestBody c = new MultipartBuilder().type(MultipartBuilder.FORM)
                .addFormDataPart("buildingName", buildingName).addFormDataPart("roomNumber", roomNumber + "")
                .addFormDataPart("longitude", longitude + "").addFormDataPart("latitude", latitude + "")
                .addFormDataPart("classroom", classroom + "").addFormDataPart("outdoor", outdoor + "")
                .addFormDataPart("open_space", open_space + "").addFormDataPart("study_room", study_room + "")
                .addFormDataPart("floor", floor + "").addFormDataPart("chairs", chairs + "").addFormDataPart("computers", computers + "")
                .addFormDataPart("whiteboards", whiteboards + "").addFormDataPart("projectors", projectors + "")
                .addFormDataPart("printers", printers + "").addFormDataPart("restricted", "0").addFormDataPart("pictureurl", "temp.jpg", RequestBody.create(MediaType.parse("image/jpg"), image)).build();

        Request request = new Request.Builder()
                .url("http://52.11.111.78/StableStudy/api/index.php/addLocation").post(c).build();
        Call call = client.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Request request, IOException e) {
                Log.v(TAG, "Could not upload picture");
            }

            @Override
            public void onResponse(Response response) throws IOException {
                String jsonData = response.body().string();
                Log.v(TAG, "JSONDATA" + jsonData);
                try {

                    JSONObject successCheck = new JSONObject(jsonData);
                    if (successCheck.getString("status").equals("success"))
                    {
                        uploadSuccessful = true;
                        runOnUiThread( new Runnable() {
                            @Override
                            public void run() {

                                finish();
                            }
                        });

                    }
                    else {
                        uploadSuccessful = false;
                        runOnUiThread( new Runnable() {
                            @Override
                            public void run() {
                                displayErrorMessage();
                            }
                        });

                    }
                } catch (JSONException e) {
                    Log.e(TAG, "json exception: ", e);
                }
            }
        });


    }

    private void displayErrorMessage() {
        Toast.makeText(this, "Room already exists", Toast.LENGTH_LONG).show();
    }


}