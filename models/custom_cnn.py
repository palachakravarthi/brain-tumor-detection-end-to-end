"""
=========================================
Brain Tumor Detection
Custom CNN Model
=========================================
"""

import tensorflow as tf

from tensorflow.keras.models import Sequential

from tensorflow.keras.layers import (
    Conv2D,
    MaxPooling2D,
    BatchNormalization,
    Flatten,
    Dense,
    Dropout
)

IMAGE_SIZE = (224,224,3)

NUM_CLASSES = 4


def build_custom_cnn():

    model = Sequential()

    # Block 1
    model.add(
        Conv2D(
            32,
            (3,3),
            activation="relu",
            padding="same",
            input_shape=IMAGE_SIZE
        )
    )

    model.add(BatchNormalization())

    model.add(MaxPooling2D((2,2)))

    model.add(Dropout(0.25))

    # Block 2
    model.add(
        Conv2D(
            64,
            (3,3),
            activation="relu",
            padding="same"
        )
    )

    model.add(BatchNormalization())

    model.add(MaxPooling2D((2,2)))

    model.add(Dropout(0.25))

    # Block 3

    model.add(
        Conv2D(
            128,
            (3,3),
            activation="relu",
            padding="same"
        )
    )

    model.add(BatchNormalization())

    model.add(MaxPooling2D((2,2)))

    model.add(Dropout(0.25))

    # Classification

    model.add(Flatten())

    model.add(Dense(512, activation="relu"))

    model.add(Dropout(0.50))

    model.add(Dense(NUM_CLASSES, activation="softmax"))

    return model


if __name__ == "__main__":

    cnn_model = build_custom_cnn()

    cnn_model.summary()