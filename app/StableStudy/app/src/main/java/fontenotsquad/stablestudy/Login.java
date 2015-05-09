package fontenotsquad.stablestudy;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.FormEncodingBuilder;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import butterknife.ButterKnife;
import butterknife.InjectView;
import butterknife.OnClick;


public class Login extends ActionBarActivity {
    public static final String TAG = Login.class.getSimpleName();


    UserData details = new UserData();

    private String jsonData;
    private boolean isValid;
    @InjectView(R.id.emailfield) EditText email;
    @InjectView(R.id.passwordfield) EditText password;
    @InjectView(R.id.loginbutton) Button login;
    @InjectView(R.id.registerbutton) Button register;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        ButterKnife.inject(this);

    }


    @OnClick(R.id.loginbutton)
    void submit(View view) {
        isValid = false;
        String emailInput = email.getText().toString();
        String pwInput = password.getText().toString();

        if (emailInput.length() > 0 && pwInput.length() > 0)
        {
            loginUser(emailInput, pwInput);
        }
        else
        {
            showErrorMessage();
        }
    }

    @OnClick(R.id.registerbutton)
    void goToRegister(View view) {
        Intent registerpage = new Intent(getApplicationContext(), RegisterPage.class);
        startActivity(registerpage);
    }

    private void goToMainPage() {
            Log.v(TAG, "is valid!");
            Intent mainPage = new Intent(getApplicationContext(), MainPage.class);
            mainPage.putExtra("user", details.getUsername());
            startActivity(mainPage);
    }
    private void showErrorMessage() {
        Toast.makeText(this, getString(R.string.invalid_account_toast), Toast.LENGTH_LONG).show();
    }


    private void loginUser(final String emailText, String pwText) {





        if (isNetWorkAvailable()) {



            OkHttpClient client = new OkHttpClient();

            RequestBody formBody = new FormEncodingBuilder()
                    .add("email", emailText).add("password", pwText)
                    .build();

            Request request = new Request.Builder().url("http://52.11.111.78/StableStudy/api/index.php/loginUser").post(formBody).build();


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
                        isValid = verifyUser();
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                if (isValid == true) {
                                    goToMainPage();
                                }
                                else
                                {
                                    showErrorMessage();
                                }
                            }
                        });

                    }
                    catch (IOException e) {
                        Log.e(TAG, "Exception caught: ", e);
                    } catch (JSONException e) {

                    }
                }
            });
            Log.d(TAG, "MAIN UI code is running!");
        }
        else {
            Toast.makeText(this, getString(R.string.no_net_toast), Toast.LENGTH_LONG).show();
        }



    }
    private boolean verifyUser() throws JSONException {

        JSONObject user = new JSONObject(jsonData);


        if (user.getString("status").equals("Failure")) {
            Log.d(TAG, "FAILED, incorrect account info");
            return false;

        }
        else {
            Log.d(TAG, "Account Info Correct");
            details.setfName(user.getString("fName"));
            details.setlName(user.getString("lName"));
            details.setUsername(user.getString("username"));
            return true;
        }
    }










    private boolean isNetWorkAvailable() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        boolean isAvailable = false;
        if (networkInfo != null && networkInfo.isConnected()){
            isAvailable = true;
        }
        return isAvailable;
    }





}
