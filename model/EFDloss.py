from torch.nn.functional import mse_loss, binary_cross_entropy
from torch.nn.modules.loss import _Loss

from model.pytorch_efd import efd, centroid


class EFDloss(_Loss):
    def __init__(self, size_average=None, reduce=None, reduction='mean', order=50):
        super().__init__(size_average, reduce, reduction)
        self.order = order

    def forward(self, model_outputs, targets):
        """
        :param model_outputs: the outputs batch from the neural net
        :param targets: the targets batch given as reference
        :return: a scalar tensor
        """
        assert targets.size(2) == 7, 'The reconstruction target should be a tensor of shape(?, 7)'
        assert model_outputs.size(2) == 7, 'The model output should be a tensor of shape(?, 7)'

        model_output_descriptors = efd(model_outputs[..., :2], order=self.order)
        target_descriptors = efd(targets[..., :2], order=self.order)
        descriptor_loss = mse_loss(model_output_descriptors, target_descriptors)

        model_output_offsets = centroid(model_outputs)
        target_offsets = centroid(targets)
        offsets_loss = mse_loss(model_output_offsets, target_offsets)

        stop_position_loss = binary_cross_entropy(model_outputs[..., -5:], targets[..., -5:])

        loss = descriptor_loss + offsets_loss + stop_position_loss
        return loss
