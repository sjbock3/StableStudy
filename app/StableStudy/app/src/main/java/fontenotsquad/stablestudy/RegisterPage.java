package fontenotsquad.stablestudy;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.FormEncodingBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.ButterKnife;
import butterknife.InjectView;
import butterknife.OnClick;


public class RegisterPage extends ActionBarActivity {

    public static final String TAG = Login.class.getSimpleName();
    @InjectView(R.id.fName) EditText fName;
    @InjectView(R.id.lName) EditText lName;
    @InjectView(R.id.regemailField) EditText email;
    @InjectView(R.id.regpwField) EditText pw;
    @InjectView(R.id.userField) EditText userF;
    @InjectView(R.id.regButton) Button regButton;
    @InjectView(R.id.statusMessage) TextView sMessage;
    private String jsonData;
    private boolean isWorking;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register_page);
        ButterKnife.inject(this);
        jsonData = "";
    }

    @OnClick(R.id.regButton)
    void createAccount(){
        boolean isValid = true;
        String fNameText = fName.getText().toString();
        String lNameText = lName.getText().toString();
        String emailText = email.getText().toString();
        String pwText = pw.getText().toString();
        String userText = pw.getText().toString();


        if (fNameText.length() < 1 || lNameText.length() < 1)
        {
            Toast.makeText(this, "Name Fields can't be empty", Toast.LENGTH_LONG).show();
            isValid = false;
        }
        if(!isEmailValid(emailText)) {
            Toast.makeText(this, "Invalid Email", Toast.LENGTH_LONG).show();
            isValid = false;
        }
        if(pwText.length() < 6) {
            Toast.makeText(this, "Password must be at least six characters", Toast.LENGTH_LONG).show();
            isValid = false;
        }
        if(userText.length() < 4) {
            Toast.makeText(this, "Username must be at least 4 characters", Toast.LENGTH_LONG).show();
            isValid = false;
        }

        if(isValid == false)
            return;



        OkHttpClient client = new OkHttpClient();



        RequestBody formBody = new FormEncodingBuilder()
                .add("fName", fNameText).add("lName", lNameText)
                .add("school", "SMU").add("username", userText)
                .add("email", emailText).add("password", pwText)
                .build();

        Request request = new Request.Builder().url("http://52.11.111.78/api/index.php/user").post(formBody).build();


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
                isWorking = false;
                try {
                    jsonData = response.body().string();
                    isWorking = verifyAccount();
                } catch (JSONException e) {
                    //This ain't the ritz carlton, I'm not gonna handle this
                }
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (isWorking == true)
                        {
                            sMessage.setText(getString(R.string.account_create_success));
                        }
                        else {
                            sMessage.setText(getString(R.string.account_create_failed));
                        }
                    }
                });

            }
        });









    }
    private boolean verifyAccount() throws JSONException
    {
        JSONObject accountValid = new JSONObject(jsonData);
        if (accountValid.getInt("u_id") == 1)
        {
            return true;
        }
        else
            return false;
    }

    private boolean isEmailValid(String email) {
        boolean isValid = false;

        String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        CharSequence inputStr = email;

        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }








}
