package fontenotsquad.stablestudy;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.melnykov.fab.FloatingActionButton;
import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.FormEncodingBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;

import butterknife.ButterKnife;
import butterknife.InjectView;
import butterknife.OnClick;
import butterknife.OnItemClick;


public class MainPage extends ActionBarActivity {

    public static final String TAG = MainPage.class.getSimpleName();
    private String jsonData;
    private ArrayList<RoomInfo> rList;
    private ArrayAdapter<RoomInfo> rListAdapter;
    private String username;
    private String wData;
    private String wColor;
    private String wString;

    @InjectView(R.id.roomListView) ListView roomView;
    @InjectView(R.id.fab) FloatingActionButton fab;
    @InjectView(R.id.weatherBar) LinearLayout wBar;
    @InjectView(R.id.weatherText) TextView wText;




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_page);
        ButterKnife.inject(this);
        Intent intent = getIntent();

        // 2. get message value from intent
        username = intent.getStringExtra("user");
        fab.attachToListView(roomView);
        getRoomInfo();
        getWeatherInfo();
    }

    private void getWeatherInfo() {

        if (isNetWorkAvailable()) {



            OkHttpClient client = new OkHttpClient();



            Request request = new Request.Builder().url("http://52.11.111.78/api/index.php/getWeather").build();


            Call call = client.newCall(request);
            call.enqueue(new Callback() {
                @Override
                public void onFailure(Request request, IOException e) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {

                        }
                    });
                }

                @Override
                public void onResponse(Response response) throws IOException {
                    try {

                        wData = response.body().string();

                        //
                        pickWeather();
                        //
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                displayWeather();
                            }
                        });

                    }
                    catch (IOException e) {
                        Log.e(TAG, "Exception caught: ", e);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONEXCEPTION",e);
                    }
                }
            });
            Log.d(TAG, "MAIN UI code is running!");
        }
        else {
            Toast.makeText(this, getString(R.string.no_net_toast), Toast.LENGTH_LONG).show();
        }

    }

    private void pickWeather() throws JSONException{
        JSONObject weatherData = new JSONObject(wData);
        boolean rain = weatherData.getBoolean("precipitation");
        boolean windy = weatherData.getBoolean("windy");
        boolean stormy = weatherData.getBoolean("storm");
        boolean sunny = weatherData.getBoolean("sunny");
        double temp = weatherData.getDouble("temperature");
        String tempMessage = "";
        String tempColor = "white";


        if (temp > 85 || sunny == true) {
            tempMessage = "Hot and sunny, stay hydrated!";
            tempColor = "red";
        }
        if (temp <= 85 || sunny == true) {
            tempMessage = "Perfect weather for studying!";
            tempColor = "lBlue";
        }

        if (sunny == false) {
            tempMessage = "Gloomy outside, you should study";
            tempColor = "grey";
        }
        if (temp < 45) {
            tempMessage = "Bring a sweater";
            tempColor = "dBlue";

        }
        if (stormy == true) {
            tempMessage = "There's a storm, be careful!";
            tempColor = "orange";
        }

        if (rain == true) {
            tempMessage = "Bring an umbrella";
            tempColor = "blue";
        }
        if (rain == true && temp < 32) {
            tempMessage = "It's Snowing! (maybe)";
            tempColor = "offwhite";

        }


        wColor = tempColor;
        wString = tempMessage;


    }
    private void displayWeather() {
        wText.setText(wString);
        if (wColor.equals("orange")) {
            wBar.setBackgroundColor(Color.parseColor("#FF9400"));
        }
        else if (wColor.equals("offwhite")) {
            wBar.setBackgroundColor(Color.parseColor("#FAFAFA"));
            wText.setTextColor(Color.parseColor("#000000"));
        }
        else if (wColor.equals("blue")) {
            wBar.setBackgroundColor(Color.parseColor("#3F51B5"));
        }
        else if (wColor.equals("dBlue")) {
            wBar.setBackgroundColor(Color.parseColor("#6A1B9A"));
        }
        else if (wColor.equals("grey")) {
            wBar.setBackgroundColor(Color.parseColor("#424242"));
        }
        else if (wColor.equals("lBlue")) {
            wBar.setBackgroundColor(Color.parseColor("#55C9EC"));
        }
        else {
            wBar.setBackgroundColor(Color.parseColor("#B71C1C"));
        }
    }

    @OnClick(R.id.fab)
    void addRoom(View view){
        Intent ar = new Intent(getApplicationContext(), AddRoom.class);
       ar.putExtra("user", username);
       startActivity(ar);

    }


    @OnItemClick(R.id.roomListView)
    void viewRoomDetails(int position)
    {
        Log.v(TAG, "Position " + position);
        Bundle extras = new Bundle();
        extras.putString("user", username);

        extras.putBoolean("computers", rList.get(position).hasComputers());
        extras.putBoolean("printers", rList.get(position).hasPrinters());
        extras.putBoolean("projectors", rList.get(position).hasProjectors());
        extras.putBoolean("whiteboards", rList.get(position).hasWhiteboards());
        extras.putBoolean("restricted", rList.get(position).isRestricted());
        extras.putString("bName", rList.get(position).getBuildingName());
        extras.putInt("rNum", rList.get(position).getRoomNumber());
        extras.putString("type", rList.get(position).getClassType());
        extras.putString("size", rList.get(position).getRmSize());
        extras.putInt("floor", rList.get(position).getFloor());
        extras.putDouble("latitude", rList.get(position).getLatitude());
        extras.putDouble("longitude", rList.get(position).getLongitude());
        Intent rDetails = new Intent(getApplicationContext(), RoomDetails.class);
        rDetails.putExtras(extras);
        startActivity(rDetails);
    }

    private void getRoomInfo() {
        rList = new ArrayList<RoomInfo>();
        jsonData = "";

        if (isNetWorkAvailable()) {



            OkHttpClient client = new OkHttpClient();



            Request request = new Request.Builder().url("http://52.11.111.78/StableStudy/api/index.php/locations").build();


            Call call = client.newCall(request);
            call.enqueue(new Callback() {
                @Override
                public void onFailure(Request request, IOException e) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {

                        }
                    });
                }

                @Override
                public void onResponse(Response response) throws IOException {
                    try {

                        jsonData = response.body().string();
                        Log.v(TAG, jsonData);
                        parseJson();
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                populateList();
                            }
                        });

                    }
                    catch (IOException e) {
                        Log.e(TAG, "Exception caught: ", e);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONEXCEPTION",e);
                    }
                }
            });
            Log.d(TAG, "MAIN UI code is running!");
        }
        else {
            Toast.makeText(this, getString(R.string.no_net_toast), Toast.LENGTH_LONG).show();
        }
    }
    private void populateList() {
        rListAdapter = new ArrayAdapter<RoomInfo>(this, android.R.layout.simple_list_item_1, rList);
        roomView.setAdapter(rListAdapter);
    }
    private void parseJson() throws JSONException {

        JSONArray rooms = new JSONArray(jsonData);
        Log.v(TAG, "Length of Rooms: " + rooms.length());
        for (int i = 0; i < rooms.length(); i++)
        {
            JSONObject tempInfo = rooms.getJSONObject(i);
            RoomInfo rTemp = new RoomInfo();
            rTemp.setBuildingName(tempInfo.getString("buildingName"));
            int type1 = tempInfo.getInt("classroom");
            int type2 = tempInfo.getInt("outdoor");
            int type3 = tempInfo.getInt("open_space");
            int type4 = tempInfo.getInt("study_room");


            if (type1 == 1) {
                rTemp.setClassType(1);
            }
            else if (type2 == 1) {
                rTemp.setClassType(2);
            }
            else if (type3 == 1) {
                rTemp.setClassType(3);
            }
            else {
                rTemp.setClassType(4);
            }


            try {
                rTemp.setFloor(tempInfo.getInt("floor"));
            } catch (JSONException e) {
                rTemp.setFloor(1);
            }

            rTemp.setComputers(tempInfo.getInt("computers"));
            rTemp.setPrinters(tempInfo.getInt("printers"));
            rTemp.setProjectors(tempInfo.getInt("projectors"));
            try {
                rTemp.setRmSize(tempInfo.getInt("chairs"));
            } catch (JSONException e) {
                rTemp.setRmSize(0);
            }

            rTemp.setRestricted(tempInfo.getInt("restricted"));
            try {
                rTemp.setRoomNumber(tempInfo.getInt("roomNumber"));
            } catch (JSONException e) {
                rTemp.setRoomNumber(0);
            }
            rTemp.setWhiteboards(tempInfo.getInt("whiteboards"));
            rTemp.setLongitude(tempInfo.getDouble("longitude"));
            rTemp.setLatitude(tempInfo.getDouble("latitude"));

            Log.v(TAG, rTemp.toString());
            rList.add(rTemp);
        }
        Log.v(TAG, "RLIST length: " + rList.size());
    }

    private boolean isNetWorkAvailable() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        Log.v(TAG, "NETWORK IS AVAILABLE");
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        boolean isAvailable = false;
        if (networkInfo != null && networkInfo.isConnected()){
            isAvailable = true;
        }

        return isAvailable;
    }










//    @Override
//    public boolean onCreateOptionsMenu(Menu menu) {
//        // Inflate the menu; this adds items to the action bar if it is present.
//        getMenuInflater().inflate(R.menu.menu_main_page, menu);
//        return true;
//    }
//
//    @Override
//    public boolean onOptionsItemSelected(MenuItem item) {
//        // Handle action bar item clicks here. The action bar will
//        // automatically handle clicks on the Home/Up button, so long
//        // as you specify a parent activity in AndroidManifest.xml.
//        int id = item.getItemId();
//
//        //noinspection SimplifiableIfStatement
//        if (id == R.id.action_settings) {
//            return true;
//        }
//
//        return super.onOptionsItemSelected(item);
//    }
}
