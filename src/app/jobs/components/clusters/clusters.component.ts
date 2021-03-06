import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Cluster, Provider, ProviderType} from "../../models/providers.model";
import {ProvidersService} from "../../services/providers.service";
import {Subject, Subscription} from "rxjs";
import {SharedFunctions} from "../../../shared/utils/shared-functions";
import {ConfirmationModalComponent} from "../../../shared/components/confirmation/confirmation-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {WaitModalComponent} from "../../../shared/components/wait-modal/wait-modal.component";
import {DisplayDialogService} from "../../../shared/services/display-dialog.service";
import {ErrorHandlingComponent} from "../../../shared/utils/error-handling-component";

@Component({
  selector: 'provider-clusters',
  templateUrl: './clusters.component.html'
})
export class ClustersComponent extends ErrorHandlingComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'version', 'state', 'startTime', 'terminationTime', 'actions'];
  clusters: Cluster[];
  provider: Provider;
  @Input() providerTypes: ProviderType[];
  @Input() providerSubject: Subject<Provider>;
  @Input() clusterSubject: Subject<Cluster>;
  subscriptions: Subscription[] = [];

  constructor(public dialog: MatDialog,
              private providersService: ProvidersService,
              private displayDialogService: DisplayDialogService) {
    super(dialog);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.providerSubject.subscribe(element => {
        const dialogRef = this.displayDialogService.openDialog(
          WaitModalComponent, {
            width: '25%',
            height: '25%',
          });
        this.provider = element;
        this.providersService.getClustersList(this.provider.id).subscribe(result => {
          dialogRef.close();
          this.clusters = result;
        });
      }));
    this.subscriptions.push(
      this.clusterSubject.subscribe(cluster => {
        this.providersService.getClustersList(this.provider.id).subscribe(result => this.clusters = result);
      }));
  }

  startCluster(cluster) {
    const waitDialogRef = this.displayDialogService.openDialog(
      WaitModalComponent, {
        width: '25%',
        height: '25%',
      });
    this.providersService.startCluster(this.provider.id, cluster).subscribe(el => {
      this.providersService.getClustersList(this.provider.id).subscribe(result => {
        waitDialogRef.close();
        this.clusters = result;
      },(error) => this.handleError(error, waitDialogRef));
    },(error) => this.handleError(error, waitDialogRef));
  }

  stopCluster(cluster) {
      const waitDialogRef = this.displayDialogService.openDialog(
        WaitModalComponent, {
          width: '25%',
          height: '25%',
        });
      this.providersService.stopCluster(this.provider.id, cluster).subscribe(el => {
        this.providersService.getClustersList(this.provider.id).subscribe(result => {
          waitDialogRef.close();
          this.clusters = result;
        },(error) => this.handleError(error, waitDialogRef));
      },(error) => this.handleError(error, waitDialogRef));
  }

  deleteCluster(cluster) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '450px',
      height: '200px',
      data: {
        message: 'Are you sure you wish to terminate this cluster? This operation is asynchronous.',
      },
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe((confirmation) => {
        if (confirmation) {
          const waitDialogRef = this.displayDialogService.openDialog(
            WaitModalComponent, {
              width: '25%',
              height: '25%',
            });
          this.providersService.deleteCluster(this.provider.id, cluster).subscribe(el => {
            this.providersService.getClustersList(this.provider.id).subscribe(result => {
              waitDialogRef.close();
              this.clusters = result;
            },(error) => this.handleError(error, waitDialogRef));
          },(error) => this.handleError(error, waitDialogRef));
        }
      }, (error) => this.handleError(error, null)));
  }

  ngOnDestroy(): void {
    this.subscriptions = SharedFunctions.clearSubscriptions(this.subscriptions);
  }

  refresh() {
    const dialogRef = this.displayDialogService.openDialog(
      WaitModalComponent, {
        width: '25%',
        height: '25%',
      });
    this.providersService.getClustersList(this.provider.id).subscribe(result => {
      dialogRef.close();
      this.clusters = result;
    }, (error) => this.handleError(error, dialogRef));
  }
}
