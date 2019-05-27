import torch


def loss_function(reconstruction_target: torch.Tensor, model_output: torch.Tensor) -> torch.Tensor:
    assert type(reconstruction_target).__name__ == 'Tensor', 'The reconstruction target should be a tensor'
    assert type(model_output).__name__ == 'Tensor', 'The model output should be a tensor'
    assert reconstruction_target.size(0) > 0, 'The reconstruction target should be a tensor with length > 0'
    assert model_output.size(0) > 0, 'The model output should be a tensor with length > 0'
    assert reconstruction_target.size(1) == 7, 'The reconstruction target should be a tensor of shape(?, 7)'
    assert model_output.size(1) == 7, 'The model output should be a tensor of shape(?, 7)'

    # Get rid of anything from and after the final stop
    reconstruction_final_stop_entries = reconstruction_target[:, 6]
    reconstruction_final_stop_index = (torch.round(reconstruction_final_stop_entries) == 1.).nonzero()
    reconstruction_target = reconstruction_target[:reconstruction_final_stop_index]

    model_output_final_stop_entries = model_output[:, 6]
    model_output_final_stop_index = (torch.round(model_output_final_stop_entries) == 1.).nonzero()
    model_output = model_output[:model_output_final_stop_index]

    reconstruction_target, _ = torch.topk(reconstruction_target, k=reconstruction_target.shape[0], dim=0)
    model_output, _ = torch.topk(model_output, k=model_output.shape[0], dim=0)
    difference = torch.abs(torch.sum(reconstruction_target - model_output))

    return difference
