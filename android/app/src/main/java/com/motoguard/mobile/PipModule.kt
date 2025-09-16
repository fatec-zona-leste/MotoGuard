package com.motoguard.mobile

import android.app.PictureInPictureParams
import android.content.res.Configuration
import android.os.Build
import android.util.DisplayMetrics
import android.util.Rational
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class PipModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "PipModule"

    @ReactMethod
    fun enterPipMode() {
        currentActivity?.enterPictureInPictureMode()
    }

    @ReactMethod
    fun exitPipMode() {
        currentActivity?.finish()
    }

    @ReactMethod
    fun isInPipMode(promise: Promise) {
        val activity = currentActivity
        if (activity != null) {
            promise.resolve(activity.isInPictureInPictureMode)
        } else {
            promise.resolve(false)
        }
    }
    @ReactMethod
    fun setAspectRatio(heightFactor: Float) {
        val activity = currentActivity ?: return
        if (activity.isInPictureInPictureMode) {
            val displayMetrics = DisplayMetrics()
            activity.windowManager.defaultDisplay.getMetrics(displayMetrics)

            val screenWidth = displayMetrics.widthPixels
            val screenHeight = displayMetrics.heightPixels

            val aspectRatio = 9f / 16f

            val pipWidth: Int
            var pipHeight: Int

            if (screenWidth > screenHeight) {
                pipWidth = screenHeight
                pipHeight = (screenHeight / aspectRatio).toInt()
            } else {
                pipWidth = screenWidth
                pipHeight = (screenWidth / aspectRatio).toInt()
            }

            pipHeight = (pipHeight * heightFactor).toInt()

            val pipBuilder = PictureInPictureParams.Builder()

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val aspectRatioRational = Rational(pipWidth, pipHeight)
                pipBuilder.setAspectRatio(aspectRatioRational)
            }

            val params = pipBuilder.build()
            activity.setPictureInPictureParams(params)
        }
    }


    fun onConfigurationChanged(newConfig: Configuration) {
        // Pode tratar mudanças se necessário
    }
}
