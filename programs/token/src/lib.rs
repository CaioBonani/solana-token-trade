use anchor_lang::prelude::*;
use anchor_spl::token::{Token, Transfer};
use anchor_lang::error_code;
use anchor_lang::solana_program::system_instruction::transfer;
use anchor_lang::solana_program::program::invoke;

declare_id!("5ugjDFNtj6UmuP1BCd4kGKFPHJowUWtktxdp8yXxRxf5");

#[program]
pub mod contract {

    use super::*;

    // pub fn transfer_sol(ctx: Context<TransferSOL>) -> Result<()> {
    //     let qtd: u64 = 1;
    //     let from = ctx.accounts.from.to_account_info();
    //     let to = ctx.accounts.to.to_account_info();

    //     if **from.try_borrow_lamports()? < qtd {
    //         return Err(CustomError::SaldoInfuciente.into());
    //     }

    //     // Debit from_account and credit to_account
    //     **from.try_borrow_mut_lamports()? -= qtd;
    //     **to.try_borrow_mut_lamports()? += qtd;

    //     Ok(())
    // }

    // pub fn transfer_token(ctx: Context<TransferToken>) -> Result<()> {
    //     let qtd: u64 = 1;

    //     // Create the Transfer struct for our context
    //     let transfer_instruction = Transfer {
    //         from: ctx.accounts.from.to_account_info(),
    //         to: ctx.accounts.to.to_account_info(),
    //         authority: ctx.accounts.from_authority.to_account_info(),
    //     };

    //     let cpi_program = ctx.accounts.token_program.to_account_info();
    //     // Create the Context for our Transfer request
    //     let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);

    //     // Execute anchor's helper function to transfer tokens
    //     anchor_spl::token::transfer(cpi_ctx, qtd)?;

    //     Ok(())
    // }

    pub fn venda(ctx: Context<Venda>, preco: u64, qtd_tokens: u64) -> Result<()> {
        
        let from = ctx.accounts.from.to_account_info();
                
        if **from.try_borrow_lamports()? < preco {
            return Err(CustomError::SaldoInfuciente.into());
        } else {

            let sol_transfer = transfer(
                ctx.accounts.from.to_account_info().key, 
                ctx.accounts.to.to_account_info().key, 
                preco
            );
    
    
    
            if let Ok(()) = invoke(
                &sol_transfer, 
                &[
                    ctx.accounts.from.to_account_info(),
                    ctx.accounts.to.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            ) {
                // Create the Transfer struct for our context
                let transfer_instruction = Transfer {
        
                    from: ctx.accounts.from.to_account_info(),
                    to: ctx.accounts.to.to_account_info(),
                    authority: ctx.accounts.from_authority.to_account_info(),
                };
        
                let cpi_program = ctx.accounts.token_program.to_account_info();
                // Create the Context for our Transfer request
                let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);
        
                // Execute anchor's helper function to transfer tokens
                anchor_spl::token::transfer(cpi_ctx, qtd_tokens)?;
            } else {
            
                return Err(CustomError2::TransferenciaSOLFalhou.into());
            }
        }
        
        Ok(())
    }


}

// #[derive(Accounts)]
// pub struct TransferToken<'info> {
//     pub token_program: Program<'info, Token>,
//     /// CHECK: The associated token account that we are transferring the token from
//     #[account(mut)]
//     pub from: UncheckedAccount<'info>,
//     /// CHECK: The associated token account that we are transferring the token to
//     #[account(mut)]
//     pub to: AccountInfo<'info>,
//     // the authority of the from account 
//     pub from_authority: Signer<'info>,
// }
// #[derive(Accounts)]
// pub struct TransferSOL<'info> {
//     #[account(mut)]
//     /// CHECK: This is not dangerous because its just a stackoverflow sample o.O
//     pub from: AccountInfo<'info>,
//     #[account(mut)]
//    /// CHECK: This is not dangerous because we just pay to this account
//     pub to: AccountInfo<'info>,
//     #[account()]
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

#[derive(Accounts)]
pub struct Venda<'info> {

    pub token_program: Program<'info, Token>,
    /// CHECK: The associated token account that we are transferring the token from
    #[account(mut)]
    pub from: UncheckedAccount<'info>,

    /// CHECK: The associated token account that we are transferring the token to
    #[account(mut)]
    pub to: AccountInfo<'info>,

    #[account()]
    pub from_authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum CustomError {
    #[msg("Saldo insuficiente")]
    SaldoInfuciente,
}

#[error_code]
pub enum CustomError2 {
    #[msg("Transferencia de SOL falhou")]
    TransferenciaSOLFalhou,
}