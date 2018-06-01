package com.example.tian_zhiqiang.wikitude;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;

import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;

import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    private ArchitectView architectView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.architectView = (ArchitectView)this.findViewById( R.id.architectView );
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration();
        config.setLicenseKey("e3ETswRRYJFtJyZ5LvQuqriJDihLzWA+CZtqcblA5+z6zS1i0a8KU26Du5YPAtIx5i+pkcOiTJ9fcvh1rVqm9nzvkp9pTzx/xsXXOznqvYxEFkC91uBtCi2BWSVpPpc3UrBn3O8kD1iGYH1vlcZ33mYQABa/e0d4Hm/Di0ho6/5TYWx0ZWRfXyYlii1dRjzNRvdNv2yrvpYvHCxw9YT+Qe2Dk8g0jXrTrbWqmofvahJYP2JhysIyTh932i7ubEwHdaSigceEvVlFhZDJx7xNPuDcv0UXYtS5oQwJvRUOvM1NX63QBbxc5elYd14I3Xis0mN5Imiwvu82O++2hxVXhTk32XJXEFCRLLnguPDiAV+UuTJU77pViFDXLnp0cf+JtZzv+rCPFKLlsxTBURi5GnjW+/qmXvzcS8LYI7+JEn3KZVKmKyhnxXr85LnDaJ3wsagiq8OEKX3AwOiHnmaTGcScDS0c7EBU+fKNvH8DH4e5CzXW9yu8gQnQbPY2t3zkQ4kyR5Tbe0cdvSbzKbE+b9JTdLYoIONPccP7pHAj4WLT7Z2n1SufImvwnLMPVFyK57+JRF7aUIVZZz7fwXq7JsV1mKFgEXByxpJyhjHNSfrdTm1cMY/8vjnTlaV3eCudWWde01F6LQVV6eO51xa3SKz1QZKjtqXmQLLz0dNY95vpzCcWQpxA0HpH9axVodZk+QRhejGAMfFHI98O+8hrNg==");
        this.architectView.onCreate( config );
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState){
        super.onPostCreate(savedInstanceState);

        this.architectView.onPostCreate();
        try {
            this.architectView.load( "http://11.111.41.189:3001/" );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected  void onPause(){
        super.onPause();

        this.architectView.onPause();
    }

    @Override
    protected  void onResume(){
        super.onResume();

        this.architectView.onResume();
    }

    @Override
    protected  void onDestroy(){
        super.onDestroy();

        this.architectView.onDestroy();
    }
}
