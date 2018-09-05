/* global $ */

function SliderTextInput (slider) {
  var textInputLeft = $(slider).closest('.form-inline').find('.slider-input-left  input[type="text"]').get().shift()
  var textInputRight = $(slider).closest('.form-inline').find('.slider-input-right input[type="text"]').get().shift()
  var textInputBottom = $(slider).closest('.form-group').find('.slider-input-right  input[type="text"]').get().shift()
  var textInput = textInputRight  || textInputRight || textInputBottom;

  var sliderValueToTextInput = function () {
    var value = $(slider).slider('getValue')
    if (Array.isArray(value)) {
      if ($(textInputLeft).val() !== value[0]) {
        $(textInputLeft).val(value[0]);
        bray_threshold1 = value[0];
      }

      if ($(textInputRight).val() !== value[1]) {
        $(textInputRight).val(value[1]);
        bray_threshold2 = value[1];
      }
    } else {
      if ($(textInput).val() !== value) {
        $(textInput).val(value)
      }
    }

    
    filtered_features = filter_edges_data(edges_data);
    draw_edges(filtered_features);
    draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
    draw_Legends();

  }

  var textInputValueToSlider = function (element) {
    var sliderValue = $(slider).slider('getValue')
    var value = parseFloat($(element).val())

    if (Array.isArray(sliderValue)) {
      if (element === textInputLeft) {
        sliderValue[0] = value;
        bray_threshold1 = value;
      } else if (element === textInputRight) {
        sliderValue[1] = value;
        bray_threshold2 = value;
      }
    } else {
      sliderValue = value
    }

    $(slider).slider('setValue', sliderValue)

    //bray_threshold = sliderValue;
    filtered_features = filter_edges_data(edges_data);
    draw_edges(filtered_features);
    draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
    draw_Legends();
  }


  $(slider).change(function () {
    sliderValueToTextInput()
  })

  $(textInputLeft).on('input', function (event) {
    textInputValueToSlider(event.target)
  })


  $(textInputRight).on('input', function (event) {
    textInputValueToSlider(event.target)
  })


  sliderValueToTextInput()
}

$.bridget('sliderTextInput', SliderTextInput)
